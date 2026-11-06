import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene.ts';
import { StorageService, SaveData } from './services/storage.ts';
import { AudioService } from './services/audio.ts';
import { OrderManager } from './core/orders.ts';
import { SambarBoostManager } from './core/boosts.ts';
import { ScoreManager } from './core/score.ts';
import { OrderUI } from './ui/orderUI.ts';
import { ModalManager } from './ui/modals.ts';
import { AdService } from './services/ads.ts';
import { getTheme } from './themes/index.ts';
import { getTodayDateString, createDailyBoard, calculateNewStreak } from './core/daily.ts';
import { cloneGrid, canMove } from './core/board.ts';
import { resetTileIdCounter } from './core/spawn.ts';
import { Grid } from './core/types.ts';
import { SeededRNG } from './core/rng.ts';

// State & Managers
let game: Phaser.Game | null = null;
let gameScene: GameScene | null = null;

const orderManager = new OrderManager();
const boostManager = new SambarBoostManager(1); // Start run with 1 boost
const scoreManager = new ScoreManager(0);

let activeThemeId = 'classic-food';
let isDailyMode = false;
let dailyRng: SeededRNG | undefined = undefined;

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
const goalTargetNameEl = document.getElementById('goal-target-name') as HTMLElement;
const goalTierBadgeEl = document.getElementById('goal-tier-badge') as HTMLElement;
const soundBtnEl = document.getElementById('sound-btn');

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

  // Initialize Order UI with working Skip and Double Reward ad callbacks
  orderUI = new OrderUI(
    'order-card-container',
    () => {
      // Skip order (free)
      orderManager.skipOrder();
      orderUI.render(null, activeThemeId);
      saveActiveGameState();
      setTimeout(() => tryGenerateNewOrder(false), 5000);
    },
    () => {
      // 2x Reward ad: Player watches ad, doubles active order reward!
      AdService.showRewardedAd('double_order', () => {
        const doubled = orderManager.doubleActiveOrderReward();
        if (doubled) {
          AudioService.playBoost();
          orderUI.render(orderManager.getActiveOrder(), activeThemeId);
          showNotification('🔥 Order reward doubled! Complete it for 2x coins & score!');
          saveActiveGameState();
        }
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

    // Check if there is an existing saved game to restore
    const save = StorageService.load();
    if (save.savedGrid && canMove(save.savedGrid)) {
      resumeSavedGame(save);
    } else {
      startNewGame();
    }

    updateGoalBanner();

    // First 30 Seconds Onboarding: auto-show tutorial if new player
    if (!save.hasSeenTutorial) {
      setTimeout(() => {
        ModalManager.showTutorialModal(() => {
          showNotification('Ready to cook! Swipe to merge dishes 🥘');
        });
      }, 350);
    }
  });

  setupEventListeners();
}

function resumeSavedGame(save: SaveData): void {
  isDailyMode = false;
  dailyRng = undefined;
  hasReachedWinThisRun = false;
  previousGridSnapshot = null;
  boostIndicatorEl.classList.add('hidden');

  scoreManager.reset(save.savedScore || 0);
  boostManager.setRemaining(save.savedBoosts !== undefined ? save.savedBoosts : 1);
  if (save.savedOrder) {
    orderManager.setActiveOrder(save.savedOrder);
  }

  // Prevent Tile ID clashes: set the counter above the highest restored tile ID!
  let maxId = 0;
  if (save.savedGrid) {
    for (const row of save.savedGrid) {
      for (const cell of row) {
        if (cell && cell.id > maxId) {
          maxId = cell.id;
        }
      }
    }
  }
  resetTileIdCounter(maxId + 1);

  updateStatsUI();
  updateBoostBadge();
  updateGoalBanner();

  gameScene?.startNewRun({
    themeId: activeThemeId,
    callbacks: createCallbacks(),
    initialGrid: save.savedGrid!
  });

  orderUI.render(orderManager.getActiveOrder(), activeThemeId);
  showNotification('💾 Previous game restored!');
}

function startNewGame(isDaily = false): void {
  isDailyMode = isDaily;
  hasReachedWinThisRun = false;
  scoreManager.reset(0);
  boostManager.setRemaining(1);
  previousGridSnapshot = null;
  boostIndicatorEl.classList.add('hidden');

  // Track games played in career stats
  StorageService.updateStats(s => {
    s.gamesPlayed++;
  });

  if (!isDailyMode) {
    resetTileIdCounter(1);
  }

  if (gameScene) {
    gameScene.setSambarMode(false);
  }

  updateStatsUI();
  updateBoostBadge();
  updateGoalBanner();

  if (isDailyMode) {
    const todayStr = getTodayDateString();
    const { grid, rng } = createDailyBoard(todayStr);
    dailyRng = rng;
    gameScene?.startNewRun({
      themeId: activeThemeId,
      callbacks: createCallbacks(),
      initialGrid: grid,
      rng
    });
  } else {
    dailyRng = undefined;
    StorageService.clearSavedBoard();
    gameScene?.startNewRun({
      themeId: activeThemeId,
      callbacks: createCallbacks()
    });
  }

  // Generate starting customer order
  orderManager.skipOrder();
  tryGenerateNewOrder(true);

  if (!isDailyMode) {
    saveActiveGameState();
  }
}

function createCallbacks() {
  return {
    onBeforeMove: (gridBeforeMove: Grid) => {
      // Snapshot the exact board and score BEFORE executeMove mutates them
      previousGridSnapshot = gridBeforeMove;
      previousScoreSnapshot = scoreManager.getScore();
    },
    onMoveSuccess: () => {
      // Save board state after EVERY move that changes the board (even non-merging slides!)
      saveActiveGameState();
    },
    onScoreGained: (gained: number) => {
      const isNewBest = scoreManager.addScore(gained);
      if (isNewBest) {
        StorageService.save({ bestScore: scoreManager.getBestScore() });
      }
      updateStatsUI();
      saveActiveGameState();
    },
    onMerges: (merges: { tier: number }[]) => {
      // Update career stats
      StorageService.updateStats(s => {
        s.totalMerges += merges.length;
        const theme = getTheme(activeThemeId);
        for (const m of merges) {
          if (m.tier > s.highestDishTier) {
            s.highestDishTier = m.tier;
            const tInfo = theme.tiers.find(t => t.tier === m.tier);
            if (tInfo) s.highestDishReached = tInfo.name;
          }
        }
      });
      updateGoalBanner();

      const orderResult = orderManager.onMerges(merges);
      if (orderResult && orderResult.completed) {
        AudioService.playOrderComplete();
        StorageService.addCoins(orderResult.coinsGained);
        StorageService.updateStats(s => { s.ordersCompleted++; });
        scoreManager.addScore(orderResult.scoreBonus);
        updateStatsUI();

        showNotification(`🎉 Order Complete! +${orderResult.coinsGained} 🪙 +${orderResult.scoreBonus} ⭐`);
        orderUI.render(null, activeThemeId);
        saveActiveGameState();
        setTimeout(() => tryGenerateNewOrder(false), 5000);
      } else {
        orderUI.render(orderManager.getActiveOrder(), activeThemeId);
        saveActiveGameState();
      }

      tryGenerateNewOrder();
    },
    onTripleMerge: () => {
      // 3-merge combo in 1 move earns Sambar boost!
      if (boostManager.addBoost()) {
        AudioService.playBoost();
        updateBoostBadge();
        saveActiveGameState();
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
        const updates: Partial<SaveData> = {
          dailyStreak: streakResult.streak,
          lastDailyDate: todayStr
        };

        // Pay 50 coins ONLY ONCE per date! Prevents coin farming exploit.
        if (save.lastDailyRewardDate !== todayStr) {
          updates.lastDailyRewardDate = todayStr;
          StorageService.addCoins(50);
          showNotification('🌟 +50 Daily Bonus Coins earned!');
        } else {
          showNotification('Daily run complete! (Today\'s 50🪙 already claimed)');
        }

        StorageService.save(updates);
        updateDailyBadge();
        updateStatsUI();
      } else {
        // Clear saved board on normal game over
        StorageService.clearSavedBoard();
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
          saveActiveGameState();
        },
        () => startNewGame(isDailyMode)
      );
    },
    onBoostTileTapped: (r: number, c: number): boolean => {
      if (!gameScene) return false;
      const grid = gameScene.getGrid();
      const tile = grid[r][c];
      if (!tile) return false;

      const theme = getTheme(activeThemeId);
      // Check maximum tier for theme (11 for food, 12 for Tamil)
      if (tile.tier >= theme.totalTiers) {
        showNotification(`✨ This dish is already at maximum tier (${theme.tiers[theme.totalTiers - 1].name})!`);
        return false;
      }

      if (boostManager.getRemaining() <= 0) {
        showNotification('No Sambar Boosts remaining!');
        return false;
      }

      // Apply boost through SambarBoostManager to decrement remaining count properly!
      const upgraded = boostManager.applyBoost(grid, r, c, theme.totalTiers);
      if (upgraded) {
        StorageService.updateStats(s => { s.sambarBoostsUsed++; });
        boostIndicatorEl.classList.add('hidden');
        updateBoostBadge();
        updateGoalBanner();
        saveActiveGameState();
        const newTierInfo = theme.tiers.find(t => t.tier === upgraded.tier);
        showNotification(`🍲 Upgraded to ${newTierInfo?.symbol} ${newTierInfo?.name}!`);
        return true;
      }
      return false;
    }
  };
}

function saveActiveGameState(): void {
  if (isDailyMode || !gameScene) return;
  const grid = gameScene.getGrid();
  if (!canMove(grid)) {
    StorageService.clearSavedBoard();
    return;
  }
  StorageService.save({
    savedGrid: cloneGrid(grid),
    savedScore: scoreManager.getScore(),
    savedBoosts: boostManager.getRemaining(),
    savedOrder: orderManager.getActiveOrder()
  });
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

  // If in daily mode, pass dailyRng so all players worldwide get identical customer orders!
  const order = orderManager.generateOrder(highestTier, themeNames, force, Date.now(), dailyRng);
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

function updateGoalBanner(): void {
  if (!goalTargetNameEl || !goalTierBadgeEl) return;
  const theme = getTheme(activeThemeId);
  const targetDish = theme.tiers[theme.totalTiers - 1];

  let currentHighest = 1;
  if (gameScene) {
    const grid = gameScene.getGrid();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] && grid[r][c]!.tier > currentHighest) {
          currentHighest = grid[r][c]!.tier;
        }
      }
    }
  }

  if (currentHighest >= theme.totalTiers) {
    goalTargetNameEl.textContent = `🎉 Mastered ${targetDish.symbol} ${targetDish.name}! Keep merging!`;
    goalTierBadgeEl.textContent = `Max Tier ${theme.totalTiers}/${theme.totalTiers}`;
    goalTierBadgeEl.style.background = '#fef08a';
    goalTierBadgeEl.style.color = '#854d0e';
  } else {
    goalTargetNameEl.textContent = `Reach ✨ ${targetDish.symbol} ${targetDish.name} (${targetDish.value})`;
    goalTierBadgeEl.textContent = `Tier ${currentHighest}/${theme.totalTiers}`;
    goalTierBadgeEl.style.background = '#ffedd5';
    goalTierBadgeEl.style.color = '#c2410c';
  }
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
    setTimeout(() => {
      if (banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }, 300);
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
      // Out of boosts: allow buying for 50 coins or watching rewarded ad (capped at 2)
      const save = StorageService.load();
      if (save.coins >= 50) {
        if (confirm('Get 1 Sambar Boost for 50 🪙? (Limit 2 per run)')) {
          StorageService.spendCoins(50);
          boostManager.addBoost();
          updateBoostBadge();
          updateStatsUI();
          saveActiveGameState();
          showNotification('🍲 +1 Sambar Boost added!');
        }
      } else {
        AdService.showRewardedAd('boost', () => {
          boostManager.addBoost();
          updateBoostBadge();
          updateStatsUI();
          saveActiveGameState();
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
      gameScene?.restoreBoard(previousGridSnapshot);
      scoreManager.reset(previousScoreSnapshot);
      previousGridSnapshot = null;
      updateStatsUI();
      updateGoalBanner();
      saveActiveGameState();
      showNotification('↩️ Move undone! (-15 🪙)');
    } else {
      AdService.showRewardedAd('undo', () => {
        gameScene?.restoreBoard(previousGridSnapshot!);
        scoreManager.reset(previousScoreSnapshot);
        previousGridSnapshot = null;
        updateStatsUI();
        updateGoalBanner();
        saveActiveGameState();
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
      updateGoalBanner();
      gameScene?.setTheme(activeThemeId);
      tryGenerateNewOrder(true);
      saveActiveGameState();
      showNotification(`🎨 Theme switched to ${getTheme(activeThemeId).name}!`);
    });
  });

  // New Game Button
  document.getElementById('new-game-btn')?.addEventListener('click', () => {
    AudioService.playTap();
    startNewGame(false);
  });

  // Settings Modals (Header and Footer)
  const openSettings = () => {
    AudioService.playTap();
    ModalManager.showSettingsModal(
      (soundEnabled) => {
        showNotification(soundEnabled ? '🔊 Sound enabled' : '🔇 Sound muted');
      },
      () => {
        ModalManager.showTutorialModal(() => {
          showNotification('Tutorial complete! Enjoy the game 🍱');
        });
      }
    );
  };

  document.getElementById('header-settings-btn')?.addEventListener('click', openSettings);
  document.getElementById('settings-btn')?.addEventListener('click', openSettings);

  // Stats Modal
  document.getElementById('stats-btn')?.addEventListener('click', () => {
    AudioService.playTap();
    ModalManager.showStatsModal();
  });

  // Sound Toggle Button (if present)
  soundBtnEl?.addEventListener('click', () => {
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
