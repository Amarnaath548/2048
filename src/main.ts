import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene.ts';
import { StorageService } from './services/storage.ts';
import { AudioService } from './services/audio.ts';
import { OrderManager } from './core/orders.ts';
import { SambarBoostManager } from './core/boosts.ts';
import { ScoreManager } from './core/score.ts';
import { OrderUI } from './ui/orderUI.ts';
import { ModalManager } from './ui/modals.ts';
import { AdService } from './services/ads.ts';
import { getTheme } from './themes/index.ts';
import { getTodayDateString, createDailyBoard, calculateNewStreak } from './core/daily.ts';
import { cloneGrid } from './core/board.ts';
import { Grid } from './core/types.ts';

// State & Managers
let game: Phaser.Game | null = null;
let gameScene: GameScene | null = null;

const orderManager = new OrderManager();
const boostManager = new SambarBoostManager(1); // Start run with 1 boost
const scoreManager = new ScoreManager(0);

let activeThemeId = 'classic-food';
let isDailyMode = false;
let previousGridSnapshot: Grid | null = null;
let previousScoreSnapshot = 0;
let hasReachedWinThisRun = false;

// DOM Elements
const currentScoreEl = document.getElementById('current-score') as HTMLElement;
const bestScoreEl = document.getElementById('best-score') as HTMLElement;
const coinCountEl = document.getElementById('coin-count') as HTMLElement;
const themePillEl = document.getElementById('theme-pill') as HTMLElement;
const boostBadgeEl = document.getElementById('boost-badge') as HTMLElement;
const dailyBadgeEl = document.getElementById('daily-badge') as HTMLElement;
const boostIndicatorEl = document.getElementById('boost-indicator') as HTMLElement;
const soundBtnEl = document.getElementById('sound-btn') as HTMLElement;

let orderUI: OrderUI;

function initGame(): void {
  // Services
  StorageService.load();
  AudioService.init();
  ModalManager.init();

  const saveData = StorageService.load();
  activeThemeId = saveData.activeThemeId || 'classic-food';
  scoreManager.setBestScore(saveData.bestScore);

  updateStatsUI();
  updateThemePill();
  updateBoostBadge();
  updateDailyBadge();

  // Initialize Order UI
  orderUI = new OrderUI(
    'order-card-container',
    () => {
      // Skip order
      orderManager.skipOrder();
      orderUI.render(null, activeThemeId);
      setTimeout(tryGenerateNewOrder, 5000);
    },
    () => {
      // 2x Reward ad
      AdService.showRewardedAd('double_order', () => {
        // Handled in order completion
      });
    }
  );

  // Initialize Phaser 3 Game with high-DPI antialiasing and smooth stepping
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 400,
    height: 400,
    backgroundColor: '#000000',
    transparent: true,
    render: {
      antialias: true,
      antialiasGL: true,
      roundPixels: false
    },
    fps: {
      target: 60,
      smoothStep: true
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [GameScene]
  };

  game = new Phaser.Game(config);

  // Once game scene boots
  game.events.once('ready', () => {
    gameScene = game!.scene.getScene('GameScene') as GameScene;
    startNewGame();
  });

  setupEventListeners();
}

function startNewGame(isDaily = false): void {
  isDailyMode = isDaily;
  hasReachedWinThisRun = false;
  scoreManager.reset(0);
  boostManager.setRemaining(1);
  previousGridSnapshot = null;
  boostIndicatorEl.classList.add('hidden');

  if (gameScene) {
    gameScene.setSambarMode(false);
  }

  updateStatsUI();
  updateBoostBadge();

  const theme = getTheme(activeThemeId);
  const themeNames: Record<number, string> = {};
  theme.tiers.forEach(t => {
    themeNames[t.tier] = t.name;
  });

  // Setup callbacks
  const callbacks = {
    onScoreGained: (gained: number) => {
      if (gameScene) {
        // Snapshot grid before moving
        previousGridSnapshot = cloneGrid(gameScene.getGrid());
        previousScoreSnapshot = scoreManager.getScore();
      }

      const isNewBest = scoreManager.addScore(gained);
      if (isNewBest) {
        StorageService.save({ bestScore: scoreManager.getBestScore() });
      }
      updateStatsUI();
    },
    onMerges: (merges: { tier: number }[]) => {
      const orderResult = orderManager.onMerges(merges);
      if (orderResult && orderResult.completed) {
        AudioService.playOrderComplete();
        StorageService.addCoins(orderResult.coinsGained);
        scoreManager.addScore(orderResult.scoreBonus);
        updateStatsUI();

        // Show completed state
        orderUI.render(null, activeThemeId);
        setTimeout(tryGenerateNewOrder, 6000);
      } else {
        orderUI.render(orderManager.getActiveOrder(), activeThemeId);
      }

      // Check if order needs generation if none active
      tryGenerateNewOrder();
    },
    onTripleMerge: () => {
      // 3-merge combo in 1 move earns Sambar boost!
      if (boostManager.addBoost()) {
        AudioService.playBoost();
        updateBoostBadge();
        showNotification('✨ 3-Merge Combo! +1 Sambar Boost earned!');
      }
    },
    onWin: () => {
      if (!hasReachedWinThisRun) {
        hasReachedWinThisRun = true;
        ModalManager.showWinModal(
          scoreManager.getScore(),
          activeThemeId,
          () => {}, // keep playing in endless mode
          () => startNewGame(isDailyMode)
        );
      }
    },
    onGameOver: (highestTier: number) => {
      if (isDailyMode) {
        // Record daily completion
        const todayStr = getTodayDateString();
        const save = StorageService.load();
        const streakResult = calculateNewStreak(save.lastDailyDate, save.dailyStreak, todayStr);
        StorageService.save({
          dailyStreak: streakResult.streak,
          lastDailyDate: todayStr
        });
        StorageService.addCoins(50); // Daily completion reward
        updateDailyBadge();
        updateStatsUI();
      }

      ModalManager.showGameOverModal(
        scoreManager.getScore(),
        scoreManager.getBestScore(),
        highestTier,
        activeThemeId,
        isDailyMode,
        () => {
          // Continue with Ad: revive board
          gameScene?.continueRevive();
        },
        () => startNewGame(isDailyMode)
      );
    },
    onBoostUsed: () => {
      boostIndicatorEl.classList.add('hidden');
      updateBoostBadge();
      showNotification('🍲 Sambar upgraded your dish!');
    }
  };

  if (isDailyMode) {
    const todayStr = getTodayDateString();
    const { grid, rng } = createDailyBoard(todayStr);
    gameScene?.startNewRun({
      themeId: activeThemeId,
      callbacks,
      initialGrid: grid,
      rng
    });
  } else {
    gameScene?.startNewRun({
      themeId: activeThemeId,
      callbacks
    });
  }

  // Generate starting customer order
  orderManager.skipOrder();
  tryGenerateNewOrder(true);
}

function tryGenerateNewOrder(force = false): void {
  if (!gameScene) return;
  const grid = gameScene.getGrid();
  let highestTier = 1;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] && grid[r][c]!.tier > highestTier) {
        highestTier = grid[r][c]!.tier;
      }
    }
  }

  const theme = getTheme(activeThemeId);
  const themeNames: Record<number, string> = {};
  theme.tiers.forEach(t => {
    themeNames[t.tier] = t.name;
  });

  const order = orderManager.generateOrder(highestTier, themeNames, force);
  orderUI.render(order, activeThemeId);
}

function updateStatsUI(): void {
  const save = StorageService.load();
  currentScoreEl.textContent = scoreManager.getScore().toLocaleString();
  bestScoreEl.textContent = scoreManager.getBestScore().toLocaleString();
  coinCountEl.textContent = save.coins.toLocaleString();
}

function updateThemePill(): void {
  const theme = getTheme(activeThemeId);
  themePillEl.textContent = `${theme.name} (${theme.tamilName})`;
}

function updateBoostBadge(): void {
  const remaining = boostManager.getRemaining();
  boostBadgeEl.textContent = `${remaining}/2`;
}

function updateDailyBadge(): void {
  const save = StorageService.load();
  dailyBadgeEl.textContent = `🔥 ${save.dailyStreak}d`;
}

function showNotification(msg: string): void {
  const banner = document.createElement('div');
  banner.style.position = 'fixed';
  banner.style.top = '20px';
  banner.style.left = '50%';
  banner.style.transform = 'translateX(-50%)';
  banner.style.background = '#1e293b';
  banner.style.color = '#ffffff';
  banner.style.padding = '8px 16px';
  banner.style.borderRadius = '20px';
  banner.style.fontSize = '13px';
  banner.style.fontWeight = 'bold';
  banner.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  banner.style.zIndex = '9999';
  banner.style.animation = 'fadeIn 0.2s';
  banner.textContent = msg;
  document.body.appendChild(banner);

  setTimeout(() => {
    banner.style.opacity = '0';
    banner.style.transition = 'opacity 0.3s';
    setTimeout(() => document.body.removeChild(banner), 300);
  }, 2500);
}

function setupEventListeners(): void {
  // Sambar Boost Button
  document.getElementById('sambar-boost-btn')?.addEventListener('click', () => {
    AudioService.playTap();
    if (boostManager.getRemaining() > 0) {
      const isNowActive = !boostIndicatorEl.classList.contains('hidden');
      if (isNowActive) {
        boostIndicatorEl.classList.add('hidden');
        gameScene?.setSambarMode(false);
      } else {
        boostIndicatorEl.classList.remove('hidden');
        gameScene?.setSambarMode(true);
      }
    } else {
      // Offer to buy boost or watch ad
      const save = StorageService.load();
      if (save.coins >= 50) {
        if (confirm('Get 1 Sambar Boost for 50 🪙?')) {
          StorageService.spendCoins(50);
          boostManager.addBoost();
          updateBoostBadge();
          updateStatsUI();
        }
      } else {
        AdService.showRewardedAd('boost', () => {
          boostManager.addBoost();
          updateBoostBadge();
          showNotification('🎉 Sambar Boost gained from rewarded ad!');
        });
      }
    }
  });

  document.getElementById('cancel-boost-btn')?.addEventListener('click', () => {
    boostIndicatorEl.classList.add('hidden');
    gameScene?.setSambarMode(false);
  });

  // Undo Button
  document.getElementById('undo-btn')?.addEventListener('click', () => {
    AudioService.playTap();
    if (!previousGridSnapshot) {
      showNotification('Cannot undo further!');
      return;
    }

    const save = StorageService.load();
    if (save.coins >= 15) {
      StorageService.spendCoins(15);
      gameScene?.resetBoard(previousGridSnapshot);
      scoreManager.reset(previousScoreSnapshot);
      previousGridSnapshot = null;
      updateStatsUI();
      showNotification('↩️ Move undone! (-15 🪙)');
    } else {
      AdService.showRewardedAd('undo', () => {
        gameScene?.resetBoard(previousGridSnapshot!);
        scoreManager.reset(previousScoreSnapshot);
        previousGridSnapshot = null;
        updateStatsUI();
        showNotification('↩️ Move undone via Rewarded Ad!');
      });
    }
  });

  // Daily Challenge Button
  document.getElementById('daily-btn')?.addEventListener('click', () => {
    AudioService.playTap();
    const todayStr = getTodayDateString();
    const save = StorageService.load();
    ModalManager.showDailyModal(todayStr, save.dailyStreak, () => {
      startNewGame(true);
      showNotification(`🍱 Daily Challenge (${todayStr}) started!`);
    });
  });

  // Themes Button
  document.getElementById('themes-btn')?.addEventListener('click', () => {
    AudioService.playTap();
    ModalManager.showThemesModal(activeThemeId, (newThemeId) => {
      activeThemeId = newThemeId;
      updateThemePill();
      gameScene?.setTheme(activeThemeId);
      tryGenerateNewOrder(true);
      showNotification(`🎨 Theme switched to ${getTheme(activeThemeId).name}!`);
    });
  });

  // New Game Button
  document.getElementById('new-game-btn')?.addEventListener('click', () => {
    AudioService.playTap();
    startNewGame(false);
  });

  // Sound Toggle Button
  soundBtnEl.addEventListener('click', () => {
    const isNowMuted = !AudioService.toggleMute();
    soundBtnEl.textContent = isNowMuted ? '🔇 Sound Off' : '🔊 Sound On';
    AudioService.playTap();
  });

  // Support Developer (UPI)
  document.getElementById('donate-btn')?.addEventListener('click', () => {
    AudioService.playTap();
    ModalManager.showDonateModal();
  });

  // How to Play Modal
  document.getElementById('help-btn')?.addEventListener('click', () => {
    AudioService.playTap();
    ModalManager.showHelpModal(activeThemeId);
  });

  // PWA Install Prompt
  let deferredPrompt: any = null;
  const installBtn = document.getElementById('install-app-btn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.onclick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          showNotification('🎉 Merge Mess installed to Home Screen!');
        }
        deferredPrompt = null;
        installBtn.style.display = 'none';
      };
    }
  });

  window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.style.display = 'none';
    deferredPrompt = null;
  });

  // Register Service Worker for offline play
  if ('serviceWorker' in navigator && !window.location.host.includes('localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
}

// Start on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  initGame();
});

