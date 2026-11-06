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
            <div class="order-desc">Make ${order.targetCount}x ${dishName}</div>
            <div class="order-progress-bar">
              <div class="order-progress-fill" style="width: ${percent}%;"></div>
            </div>
          </div>
        </div>
        <div class="order-right">
          <div class="order-reward-badge" title="Reward on completing this order">
            +${order.rewardCoins} 🪙 +${order.rewardScore} ⭐
          </div>
          <button id="skip-order-btn" class="skip-btn" title="Skip this order (free)">✕</button>
        </div>
      </div>
    `;

    const skipBtn = this.container.querySelector('#skip-order-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.onSkipCallback());
    }
  }
}

