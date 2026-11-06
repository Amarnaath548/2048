import { Order } from '../core/types.ts';
import { getTheme } from '../themes/index.ts';

export class OrderUI {
  private container: HTMLElement;
  private onSkipCallback: () => void;
  private onDoubleRewardCallback: () => void;

  constructor(
    containerId: string,
    onSkip: () => void,
    onDoubleReward: () => void
  ) {
    this.container = document.getElementById(containerId) || document.body;
    this.onSkipCallback = onSkip;
    this.onDoubleRewardCallback = onDoubleReward;
  }

  public render(order: Order | null, activeThemeId: string): void {
    if (!order) {
      this.container.innerHTML = `
        <div style="background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 10px; padding: 12px; text-align: center; font-size: 13px; color: #64748b;">
          👨🏽‍🍳 <em>Waiting for next customer order... keep merging!</em>
        </div>
      `;
      return;
    }

    const theme = getTheme(activeThemeId);
    const tierInfo = theme.tiers.find(t => t.tier === order.targetTier);
    const dishName = tierInfo ? `${tierInfo.symbol} ${tierInfo.name}` : `Tier ${order.targetTier}`;
    const percent = Math.min(100, Math.round((order.currentCount / order.targetCount) * 100));

    this.container.innerHTML = `
      <div class="order-card">
        <div class="order-left">
          <div class="order-avatar">${order.customerEmoji}</div>
          <div>
            <div class="order-title">${order.customerName}'s Order</div>
            <div class="order-desc">Make ${order.targetCount}x ${dishName} (${order.currentCount}/${order.targetCount})</div>
            <div class="order-progress-bar">
              <div class="order-progress-fill" style="width: ${percent}%;"></div>
            </div>
          </div>
        </div>
        <div class="order-right" style="display: flex; align-items: center; gap: 6px;">
          <div class="order-reward-badge" style="${order.isDoubled ? 'background: #fef08a; border-color: #eab308; color: #854d0e; font-weight: 800;' : ''}" title="Reward on completing this order">
            ${order.isDoubled ? '🔥 2X: ' : ''}+${order.rewardCoins} 🪙 +${order.rewardScore} ⭐
          </div>
          ${
            !order.isDoubled
              ? `<button id="double-reward-btn" style="background: #0284c7; color: #fff; border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;" title="Watch a quick ad to double this order reward!">🎬 2x</button>`
              : ''
          }
          <button id="skip-order-btn" class="skip-btn" title="Skip this order (free)">✕</button>
        </div>
      </div>
    `;

    const skipBtn = this.container.querySelector('#skip-order-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.onSkipCallback());
    }

    const doubleBtn = this.container.querySelector('#double-reward-btn');
    if (doubleBtn) {
      doubleBtn.addEventListener('click', () => this.onDoubleRewardCallback());
    }
  }
}
