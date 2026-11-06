import { Grid, Tile } from './types.ts';

export const MAX_BOOSTS_PER_RUN = 2;
export const SAMBAR_BOOST_COIN_COST = 50;

export class SambarBoostManager {
  private remainingBoosts: number;

  constructor(initialBoosts = 1) {
    this.remainingBoosts = Math.min(initialBoosts, MAX_BOOSTS_PER_RUN);
  }

  public getRemaining(): number {
    return this.remainingBoosts;
  }

  public setRemaining(count: number): void {
    this.remainingBoosts = Math.max(0, Math.min(count, MAX_BOOSTS_PER_RUN));
  }

  /**
   * Adds a boost (e.g. from 3-merge combo, coins, or rewarded ad), capped at MAX_BOOSTS_PER_RUN.
   * Returns true if successfully added, false if already at maximum.
   */
  public addBoost(): boolean {
    if (this.remainingBoosts < MAX_BOOSTS_PER_RUN) {
      this.remainingBoosts++;
      return true;
    }
    return false;
  }

  /**
   * Applies Sambar boost to upgrade chosen tile by 1 tier.
   * Returns upgraded tile or null if invalid.
   */
  public applyBoost(grid: Grid, r: number, c: number, maxTier = 11): Tile | null {
    if (this.remainingBoosts <= 0) return null;
    const tile = grid[r][c];
    if (!tile) return null;

    if (tile.tier >= maxTier) {
      // Already at maximum tier
      return null;
    }

    this.remainingBoosts--;
    tile.tier += 1;
    tile.value = Math.pow(2, tile.tier);
    tile.isMerged = true; // highlight animation
    return tile;
  }
}

