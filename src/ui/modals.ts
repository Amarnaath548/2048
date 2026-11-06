import { StorageService } from '../services/storage.ts';
import { ALL_THEMES, getTheme } from '../themes/index.ts';
import { ShareService } from '../services/share.ts';
import { AdService } from '../services/ads.ts';
import confetti from 'canvas-confetti';

export class ModalManager {
  private static container: HTMLElement;

  public static init(): void {
    this.container = document.getElementById('modal-container') || document.body;
  }

  public static close(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * UPI Support Developer Modal
   */
  public static showDonateModal(): void {
    const upiId = 'amarnaath@upi';
    const upiPayUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=MergeMess&cu=INR&tn=Support%20Merge%20Mess`;

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-content" style="text-align: center;">
          <div class="modal-header">
            <h2 class="modal-title">☕ Support the Developer</h2>
            <button class="close-btn" id="modal-close-x">✕</button>
          </div>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 16px; line-height: 1.4;">
            Merge Mess is 100% free with no annoying forced popups. If you enjoyed playing or learning Tamil, consider buying a filter coffee!
          </p>

          <!-- Clean Canvas/SVG QR Code Display -->
          <div style="background: #ffffff; padding: 16px; border: 2px dashed #f59e0b; border-radius: 12px; display: inline-block; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.06);">
            <svg width="180" height="180" viewBox="0 0 180 180" style="display:block; margin:0 auto;">
              <!-- Border & Background -->
              <rect width="180" height="180" fill="#ffffff" rx="8"/>
              <!-- Decorative stylized QR pattern -->
              <rect x="20" y="20" width="40" height="40" fill="#000" rx="4"/>
              <rect x="26" y="26" width="28" height="28" fill="#fff" rx="2"/>
              <rect x="32" y="32" width="16" height="16" fill="#000" rx="1"/>

              <rect x="120" y="20" width="40" height="40" fill="#000" rx="4"/>
              <rect x="126" y="26" width="28" height="28" fill="#fff" rx="2"/>
              <rect x="132" y="32" width="16" height="16" fill="#000" rx="1"/>

              <rect x="20" y="120" width="40" height="40" fill="#000" rx="4"/>
              <rect x="26" y="126" width="28" height="28" fill="#fff" rx="2"/>
              <rect x="32" y="132" width="16" height="16" fill="#000" rx="1"/>

              <!-- Central coffee cup icon -->
              <circle cx="90" cy="90" r="18" fill="#ea580c"/>
              <text x="90" y="96" font-size="16" text-anchor="middle" fill="#fff">☕</text>

              <!-- QR data blocks -->
              <rect x="70" y="25" width="10" height="10" fill="#000"/>
              <rect x="85" y="25" width="10" height="10" fill="#000"/>
              <rect x="100" y="25" width="10" height="10" fill="#000"/>
              <rect x="25" y="70" width="10" height="10" fill="#000"/>
              <rect x="25" y="85" width="10" height="10" fill="#000"/>
              <rect x="25" y="100" width="10" height="10" fill="#000"/>
              <rect x="70" y="45" width="10" height="10" fill="#000"/>
              <rect x="85" y="60" width="10" height="10" fill="#000"/>
              <rect x="120" y="75" width="10" height="10" fill="#000"/>
              <rect x="145" y="75" width="10" height="10" fill="#000"/>
              <rect x="135" y="95" width="10" height="10" fill="#000"/>
              <rect x="70" y="125" width="10" height="10" fill="#000"/>
              <rect x="85" y="145" width="10" height="10" fill="#000"/>
              <rect x="100" y="125" width="10" height="10" fill="#000"/>
              <rect x="120" y="140" width="10" height="10" fill="#000"/>
              <rect x="140" y="125" width="10" height="10" fill="#000"/>
              <rect x="140" y="145" width="10" height="10" fill="#000"/>
            </svg>
            <div style="font-size: 11px; font-weight: bold; color: #ea580c; margin-top: 6px;">SCAN WITH ANY UPI APP</div>
          </div>

          <!-- UPI ID Display & Copy -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-family: monospace; font-size: 14px; font-weight: bold; color: #1e293b;">${upiId}</span>
            <button id="copy-upi-btn" style="background: #e2e8f0; border: none; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
              Copy ID
            </button>
          </div>

          <!-- Direct Pay Button on Android/Mobile -->
          <a href="${upiPayUrl}" class="btn-primary" style="text-decoration: none; margin-bottom: 10px;">
            📱 Pay with UPI App (GPay / PhonePe / Paytm)
          </a>

          <p style="font-size: 11px; color: #94a3b8; line-height: 1.3;">
            Donations are purely voluntary tips. They do not unlock extra power-ups, keeping the game 100% fair for everyone.
          </p>
        </div>
      </div>
    `;

    document.getElementById('modal-close-x')?.addEventListener('click', () => this.close());
    document.getElementById('copy-upi-btn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(upiId);
      const btn = document.getElementById('copy-upi-btn');
      if (btn) btn.textContent = '✓ Copied!';
      setTimeout(() => {
        if (btn) btn.textContent = 'Copy ID';
      }, 2000);
    });
  }

  /**
   * Themes & Skins Selector Modal
   */
  public static showThemesModal(
    currentThemeId: string,
    onSelectTheme: (themeId: string) => void
  ): void {
    const save = StorageService.load();
    const themesList = Object.values(ALL_THEMES);

    const cardsHtml = themesList.map(t => {
      const isUnlocked = save.unlockedThemes.includes(t.id);
      const isActive = t.id === currentThemeId;

      return `
        <div class="theme-card" style="border: 2px solid ${isActive ? '#ea580c' : '#e2e8f0'}; background: ${isActive ? '#fff7ed' : '#ffffff'}; border-radius: 12px; padding: 14px; margin-bottom: 12px; text-align: left;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <h3 style="font-size: 16px; font-weight: 800; color: #1e293b; margin: 0;">${t.name}</h3>
              <div style="font-family: var(--font-tamil); font-size: 13px; color: #78716c;">${t.tamilName}</div>
            </div>
            ${isActive ? '<span style="background: #ea580c; color: #fff; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 12px;">ACTIVE</span>' : ''}
          </div>
          <p style="font-size: 12px; color: #64748b; margin-bottom: 10px;">${t.description}</p>
          <div style="display: flex; gap: 4px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 10px;">
            ${t.tiers.slice(0, 6).map(tier => `
              <div style="background: ${tier.bgColor}; color: ${tier.textColor}; width: 34px; height: 34px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0;" title="${tier.name}">
                ${tier.symbol}
              </div>
            `).join('')}
            <div style="background: #f1f5f9; color: #64748b; width: 34px; height: 34px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; flex-shrink: 0;">
              +${t.tiers.length - 6}
            </div>
          </div>
          ${
            isActive
              ? '<button disabled style="background: #e2e8f0; color: #64748b; border: none; padding: 8px; width: 100%; border-radius: 8px; font-weight: bold; font-size: 13px;">Selected</button>'
              : isUnlocked
              ? `<button class="select-theme-btn" data-theme="${t.id}" style="background: #ea580c; color: #fff; border: none; padding: 8px; width: 100%; border-radius: 8px; font-weight: bold; font-size: 13px; cursor: pointer;">Equip Skin</button>`
              : `<button class="unlock-theme-btn" data-theme="${t.id}" data-cost="${t.unlockCost}" style="background: #0284c7; color: #fff; border: none; padding: 8px; width: 100%; border-radius: 8px; font-weight: bold; font-size: 13px; cursor: pointer;">Unlock for ${t.unlockCost} 🪙</button>`
          }
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">🎨 Select Game Theme</h2>
            <button class="close-btn" id="modal-close-x">✕</button>
          </div>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 14px;">
            Choose your favourite visual pack! More themes (Chennai Street Food, Chettinad) coming in future updates.
          </p>
          <div class="themes-list">
            ${cardsHtml}
          </div>
        </div>
      </div>
    `;

    document.getElementById('modal-close-x')?.addEventListener('click', () => this.close());

    this.container.querySelectorAll('.select-theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const themeId = (e.currentTarget as HTMLElement).getAttribute('data-theme')!;
        StorageService.save({ activeThemeId: themeId });
        onSelectTheme(themeId);
        this.close();
      });
    });

    this.container.querySelectorAll('.unlock-theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const themeId = target.getAttribute('data-theme')!;
        const cost = parseInt(target.getAttribute('data-cost')!, 10);

        if (StorageService.spendCoins(cost)) {
          StorageService.unlockTheme(themeId);
          StorageService.save({ activeThemeId: themeId });
          onSelectTheme(themeId);
          this.close();
        } else {
          alert(`Not enough coins! You need ${cost} 🪙. Complete customer orders or daily challenges to earn more!`);
        }
      });
    });
  }

  /**
   * Daily Challenge Modal
   */
  public static showDailyModal(
    todayDateStr: string,
    streak: number,
    onStartDaily: () => void
  ): void {
    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-content" style="text-align: center;">
          <div class="modal-header">
            <h2 class="modal-title">📅 Daily Challenge</h2>
            <button class="close-btn" id="modal-close-x">✕</button>
          </div>
          <div style="font-size: 40px; margin: 8px 0;">🌟 🍱</div>
          <h3 style="font-size: 17px; margin-bottom: 4px;">Challenge for ${todayDateStr}</h3>
          <div style="background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 13px; display: inline-block; margin-bottom: 16px;">
            🔥 Current Streak: ${streak} Days
          </div>
          <p style="font-size: 13px; color: #64748b; line-height: 1.4; margin-bottom: 18px; text-align: left;">
            • Every player in the world starts with the <strong>exact same board and tile order</strong> keyed by today's date.<br>
            • Push for your highest score and dishes.<br>
            • Earn <strong>+50 Bonus Coins</strong> on finishing today's challenge!
          </p>
          <button id="start-daily-btn" class="btn-primary" style="margin-bottom: 8px;">
            Play Today's Challenge
          </button>
        </div>
      </div>
    `;

    document.getElementById('modal-close-x')?.addEventListener('click', () => this.close());
    document.getElementById('start-daily-btn')?.addEventListener('click', () => {
      this.close();
      onStartDaily();
    });
  }

  /**
   * Game Over Modal with Rewarded Ad Continue option
   */
  public static showGameOverModal(
    score: number,
    bestScore: number,
    highestTier: number,
    activeThemeId: string,
    isDaily: boolean,
    onContinueWithAd: () => void,
    onRestart: () => void
  ): void {
    const theme = getTheme(activeThemeId);
    const tier = theme.tiers.find(t => t.tier === highestTier) || theme.tiers[0];

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-content" style="text-align: center;">
          <div style="font-size: 46px; margin-bottom: 8px;">🍽️</div>
          <h2 style="font-size: 22px; font-weight: 800; color: #1e293b; margin-bottom: 4px;">No More Merges!</h2>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">The kitchen has run out of space on the board.</p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-bottom: 16px;">
            <div style="font-size: 12px; color: #64748b; font-weight: bold;">FINAL SCORE</div>
            <div style="font-size: 28px; font-weight: 800; color: #ea580c;">${score.toLocaleString()}</div>
            <div style="font-size: 12px; color: #16a34a; margin-top: 4px;">Best: ${bestScore.toLocaleString()}</div>

            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span style="font-size: 20px;">${tier.symbol}</span>
              <span style="font-weight: bold; font-size: 14px;">Highest: ${tier.name}</span>
            </div>
          </div>

          <!-- Optional Rewarded Ad Continue -->
          <button id="ad-continue-btn" class="btn-primary" style="background: #0284c7; margin-bottom: 10px;">
            🎬 Watch Ad to Continue (Clears 4 Tiles)
          </button>

          <!-- WhatsApp / Social Share -->
          <button id="share-result-btn" class="btn-primary" style="background: #25d366; margin-bottom: 10px;">
            📱 Share Score on WhatsApp
          </button>

          <button id="restart-game-btn" class="btn-secondary">
            🔄 Start New Game
          </button>
        </div>
      </div>
    `;

    document.getElementById('ad-continue-btn')?.addEventListener('click', () => {
      AdService.showRewardedAd('continue', () => {
        ModalManager.close();
        onContinueWithAd();
      });
    });

    document.getElementById('share-result-btn')?.addEventListener('click', () => {
      ShareService.shareDailyResult({
        dateStr: new Date().toLocaleDateString(),
        score,
        highestTierName: tier.name,
        highestTierSymbol: tier.symbol,
        streak: StorageService.load().dailyStreak
      });
    });

    document.getElementById('restart-game-btn')?.addEventListener('click', () => {
      ModalManager.close();
      onRestart();
    });
  }

  /**
   * Win Modal (Golden Feast / 2048 reached!)
   */
  public static showWinModal(
    score: number,
    themeId: string,
    onContinue: () => void,
    onNewGame: () => void
  ): void {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const theme = getTheme(themeId);
    const winTier = theme.tiers[theme.tiers.length - 1];

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-content" style="text-align: center;">
          <div style="font-size: 50px; margin-bottom: 6px;">✨ 👑 ✨</div>
          <h2 style="font-size: 24px; font-weight: 800; color: #ea580c; margin-bottom: 4px;">Grand Victory!</h2>
          <div style="font-family: var(--font-tamil); font-size: 16px; color: #78716c; margin-bottom: 12px;">${winTier.tamilName}</div>
          <p style="font-size: 14px; color: #475569; margin-bottom: 16px;">
            You have unlocked the legendary <strong>${winTier.name}</strong> (${winTier.symbol})! Your culinary and merging skills are unmatched.
          </p>

          <div style="background: #fef3c7; border: 1.5px solid #f59e0b; border-radius: 12px; padding: 12px; margin-bottom: 18px;">
            <div style="font-size: 12px; font-weight: bold; color: #92400e;">CURRENT SCORE</div>
            <div style="font-size: 26px; font-weight: 800; color: #b45309;">${score.toLocaleString()}</div>
          </div>

          <button id="win-continue-btn" class="btn-primary" style="margin-bottom: 8px;">
            🔥 Keep Playing (Endless Mode)
          </button>
          <button id="win-new-game-btn" class="btn-secondary">
            🔄 Start Fresh Run
          </button>
        </div>
      </div>
    `;

    document.getElementById('win-continue-btn')?.addEventListener('click', () => {
      this.close();
      onContinue();
    });

    document.getElementById('win-new-game-btn')?.addEventListener('click', () => {
      this.close();
      onNewGame();
    });
  }

  /**
   * How to Play Modal
   */
  public static showHelpModal(currentThemeId: string): void {
    const theme = getTheme(currentThemeId);

    const tiersList = theme.tiers.map(t => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 18px; width: 24px; text-align: center;">${t.symbol}</span>
          <div>
            <div style="font-size: 13px; font-weight: bold; color: #1e293b;">${t.name}</div>
            <div style="font-size: 11px; color: #64748b;">${t.tamilName || ''}</div>
          </div>
        </div>
        <span style="font-size: 12px; font-weight: bold; color: #ea580c; background: #fff7ed; padding: 2px 6px; border-radius: 4px;">Tier ${t.tier} (${t.value})</span>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">📖 How to Play</h2>
            <button class="close-btn" id="modal-close-x">✕</button>
          </div>
          <div style="font-size: 13px; color: #475569; line-height: 1.5; margin-bottom: 14px;">
            1. <strong>Swipe</strong> (or use Arrow / WASD keys) in any direction to slide all tiles.<br>
            2. When two equal dishes collide, they merge into the next tier!<br>
            3. Complete <strong>Customer Orders</strong> to earn Coins 🪙 and Score bonus ⭐.<br>
            4. Use <strong>Sambar Boost 🍲</strong> to upgrade any tile by 1 tier (earned by 3-merge combos, coins, or ads).
          </div>
          <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 8px; color: #1e293b;">Tile Progression</h3>
          <div style="max-height: 240px; overflow-y: auto; margin-bottom: 16px; padding-right: 4px;">
            ${tiersList}
          </div>
          <button id="close-help-btn" class="btn-primary">Got it, Let's Cook!</button>
        </div>
      </div>
    `;

    document.getElementById('modal-close-x')?.addEventListener('click', () => this.close());
    document.getElementById('close-help-btn')?.addEventListener('click', () => this.close());
  }
}

