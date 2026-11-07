import { Grid, Order } from '../core/types.ts';

export interface GameStats {
  gamesPlayed: number;
  totalMerges: number;
  ordersCompleted: number;
  highestDishReached: string;
  highestDishTier: number;
  highestTamilTier: number;
  sambarBoostsUsed: number;
  totalScoreEarned: number;
}

export interface SaveData {
  bestScore: number;
  coins: number;
  unlockedThemes: string[];
  activeThemeId: string;
  dailyStreak: number;
  lastDailyDate: string | null;
  lastDailyRewardDate: string | null;
  soundEnabled: boolean;
  seenTamilInfo: string[];
  savedGrid: Grid | null;
  savedScore: number;
  savedBoosts: number;
  savedOrder: Order | null;
  hasSeenTutorial: boolean;
  stats: GameStats;
  dailyLoginStreak: number;
  lastDailyLoginClaimDate: string | null;
  unlockedAchievements: string[];
  unlockedDishTiers: { [themeId: string]: number[] };
}

const STORAGE_KEY = 'MERGE_MESS_SAVE_V1';

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  totalMerges: 0,
  ordersCompleted: 0,
  highestDishReached: 'Rice Grain',
  highestDishTier: 1,
  highestTamilTier: 1,
  sambarBoostsUsed: 0,
  totalScoreEarned: 0
};

const DEFAULT_SAVE: SaveData = {
  bestScore: 0,
  coins: 50, // Starting gift to try boosts/themes
  unlockedThemes: ['classic-food'],
  activeThemeId: 'classic-food',
  dailyStreak: 0,
  lastDailyDate: null,
  lastDailyRewardDate: null,
  soundEnabled: true,
  seenTamilInfo: [],
  savedGrid: null,
  savedScore: 0,
  savedBoosts: 1,
  savedOrder: null,
  hasSeenTutorial: false,
  stats: DEFAULT_STATS,
  dailyLoginStreak: 0,
  lastDailyLoginClaimDate: null,
  unlockedAchievements: [],
  unlockedDishTiers: {
    'classic-food': [1],
    'tamil-letters': [1]
  }
};

export class StorageService {
  private static cachedData: SaveData | null = null;

  public static load(): SaveData {
    if (this.cachedData) return this.cachedData;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.cachedData = {
          ...DEFAULT_SAVE,
          ...parsed,
          stats: { ...DEFAULT_STATS, ...(parsed.stats || {}) }
        };
        return this.cachedData!;
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    this.cachedData = { ...DEFAULT_SAVE };
    return this.cachedData;
  }

  public static save(data: Partial<SaveData>): SaveData {
    const current = this.load();
    const updated = { ...current, ...data };
    this.cachedData = updated;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
    return updated;
  }

  public static updateStats(updater: (stats: GameStats) => void): void {
    const current = this.load();
    const stats = { ...current.stats };
    updater(stats);
    this.save({ stats });
  }

  public static addCoins(amount: number): number {
    const data = this.load();
    data.coins = Math.max(0, data.coins + amount);
    this.save({ coins: data.coins });
    return data.coins;
  }

  public static spendCoins(amount: number): boolean {
    const data = this.load();
    if (data.coins >= amount) {
      data.coins -= amount;
      this.save({ coins: data.coins });
      return true;
    }
    return false;
  }

  public static unlockTheme(themeId: string): boolean {
    const data = this.load();
    if (!data.unlockedThemes.includes(themeId)) {
      data.unlockedThemes.push(themeId);
      this.save({ unlockedThemes: data.unlockedThemes });
      return true;
    }
    return false;
  }

  public static recordDishTier(themeId: string, tier: number): boolean {
    const data = this.load();
    const currentTiers = data.unlockedDishTiers[themeId] || [];
    if (!currentTiers.includes(tier)) {
      const updatedTiers = [...currentTiers, tier].sort((a, b) => a - b);
      const unlockedDishTiers = {
        ...data.unlockedDishTiers,
        [themeId]: updatedTiers
      };
      this.save({ unlockedDishTiers });
      return true; // Newly unlocked dish!
    }
    return false;
  }

  public static unlockAchievement(id: string): boolean {
    const data = this.load();
    const achievements = data.unlockedAchievements || [];
    if (!achievements.includes(id)) {
      const updated = [...achievements, id];
      this.save({ unlockedAchievements: updated });
      return true;
    }
    return false;
  }

  public static claimDailyReward(todayStr: string, streak: number, coins: number): void {
    const data = this.load();
    const newCoins = data.coins + coins;
    this.save({
      coins: newCoins,
      dailyLoginStreak: streak,
      lastDailyLoginClaimDate: todayStr
    });
  }

  public static clearSavedBoard(): void {
    this.save({
      savedGrid: null,
      savedScore: 0,
      savedBoosts: 1,
      savedOrder: null
    });
  }
}
