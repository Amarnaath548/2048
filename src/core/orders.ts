import { Order } from './types.ts';

const CUSTOMERS = [
  { name: 'Kavitha Akka', emoji: '👩🏽‍🍳' },
  { name: 'Murugan Mama', emoji: '👨🏽' },
  { name: 'Priya', emoji: '👧🏽' },
  { name: 'Chef Selvam', emoji: '👨🏽‍🍳' },
  { name: 'Grandma Meena', emoji: '👵🏽' },
  { name: 'Anand', emoji: '🧑🏽‍🎓' }
];

export class OrderManager {
  private activeOrder: Order | null = null;
  private lastOrderGeneratedTime = 0;
  private orderMinCooldownMs = 15000; // Cooldown between orders (or 30s)

  public getActiveOrder(): Order | null {
    return this.activeOrder;
  }

  public setActiveOrder(order: Order | null): void {
    this.activeOrder = order;
  }

  /**
   * Generates a new customer order based on player's highest current tier.
   * Never asks for an impossible tier! Target tier is bounded between 2 and max(2, highestTier).
   */
  public generateOrder(
    highestCurrentTier: number,
    themeTierNames: { [tier: number]: string },
    force = false,
    now = Date.now()
  ): Order | null {
    if (this.activeOrder && !force) {
      return this.activeOrder;
    }

    if (!force && now - this.lastOrderGeneratedTime < this.orderMinCooldownMs) {
      return null;
    }

    // Customer picks a dish reachable by player: between tier 2 and min(highestCurrentTier + 1, 11)
    const minTier = 2;
    const maxPossible = Math.max(minTier, Math.min(highestCurrentTier + 1, 10));
    const targetTier = Math.floor(Math.random() * (maxPossible - minTier + 1)) + minTier;

    // Quantity: 1 or 2 (higher tier usually 1)
    const targetCount = targetTier >= 6 ? 1 : Math.random() < 0.6 ? 1 : 2;

    const dishName = themeTierNames[targetTier] || `Tier ${targetTier}`;
    const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];

    // Rewards scale with tier and count
    const rewardCoins = targetTier * 5 * targetCount;
    const rewardScore = targetTier * 50 * targetCount;

    const newOrder: Order = {
      id: `ord_${now}_${Math.random().toString(36).substring(2, 6)}`,
      targetTier,
      targetCount,
      currentCount: 0,
      rewardCoins,
      rewardScore,
      customerName: customer.name,
      customerEmoji: customer.emoji,
      createdAt: now
    };

    this.activeOrder = newOrder;
    this.lastOrderGeneratedTime = now;
    return newOrder;
  }

  /**
   * Inspects merges from a move and checks if order progress was made.
   * Returns completion result if order fulfilled.
   */
  public onMerges(merges: { tier: number }[]): { completed: boolean; order: Order; coinsGained: number; scoreBonus: number } | null {
    if (!this.activeOrder) return null;

    let hits = 0;
    for (const m of merges) {
      if (m.tier === this.activeOrder.targetTier) {
        hits++;
      }
    }

    if (hits > 0) {
      this.activeOrder.currentCount += hits;
      if (this.activeOrder.currentCount >= this.activeOrder.targetCount) {
        const completedOrder = { ...this.activeOrder };
        this.activeOrder = null;
        this.lastOrderGeneratedTime = Date.now();
        return {
          completed: true,
          order: completedOrder,
          coinsGained: completedOrder.rewardCoins,
          scoreBonus: completedOrder.rewardScore
        };
      }
    }

    return null;
  }

  /**
   * Skip an order: costs nothing, never blocks play.
   */
  public skipOrder(): void {
    this.activeOrder = null;
    this.lastOrderGeneratedTime = Date.now();
  }
}

