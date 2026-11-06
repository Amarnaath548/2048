export type AdPlacement = 'undo' | 'boost' | 'continue' | 'double_order';

export class AdService {
  /**
   * Shows a simulated or AdMob rewarded ad.
   * Resolves true if player watched to completion, false if dismissed early.
   */
  public static showRewardedAd(placement: AdPlacement, onReward: () => void): void {
    // Create an in-game simulated rewarded ad overlay
    const overlay = document.createElement('div');
    overlay.className = 'ad-modal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.color = '#ffffff';
    overlay.style.fontFamily = 'system-ui, sans-serif';
    overlay.style.padding = '20px';
    overlay.style.boxSizing = 'border-box';

    let countdown = 3;

    overlay.innerHTML = `
      <div style="background: #1e293b; border: 2px solid #f59e0b; border-radius: 16px; padding: 24px; max-width: 360px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        <div style="background: #f59e0b; color: #000; font-weight: bold; font-size: 11px; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 12px; letter-spacing: 1px;">
          REWARDED AD (${placement.toUpperCase()})
        </div>
        <div style="font-size: 40px; margin: 10px 0;">☕ 🫓</div>
        <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #f8fafc;">Filter Coffee & Fresh Dosas</h3>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 16px; line-height: 1.4;">
          Traditional Kumbakonam Degree Coffee & Crispy Podi Roast. Best served hot!
        </p>
        <div id="ad-timer" style="font-size: 15px; font-weight: bold; color: #38bdf8; margin-bottom: 12px;">
          Reward unlocks in ${countdown}s...
        </div>
        <button id="ad-claim-btn" disabled style="background: #475569; color: #cbd5e1; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: not-allowed; width: 100%;">
          Wait for reward...
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    const timerEl = overlay.querySelector('#ad-timer') as HTMLElement;
    const claimBtn = overlay.querySelector('#ad-claim-btn') as HTMLButtonElement;

    const interval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        if (timerEl) timerEl.textContent = `Reward unlocks in ${countdown}s...`;
      } else {
        clearInterval(interval);
        if (timerEl) {
          timerEl.textContent = '🎉 Reward Ready!';
          timerEl.style.color = '#22c55e';
        }
        if (claimBtn) {
          claimBtn.disabled = false;
          claimBtn.style.background = '#22c55e';
          claimBtn.style.color = '#ffffff';
          claimBtn.style.cursor = 'pointer';
          claimBtn.textContent = 'Claim Reward';
          claimBtn.onclick = () => {
            document.body.removeChild(overlay);
            onReward();
          };
        }
      }
    }, 1000);
  }
}

