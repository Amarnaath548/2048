export interface SaveData {
  bestScore: number;
  coins: number;
  unlockedThemes: string[];
  activeThemeId: string;
  dailyStreak: number;
  lastDailyDate: string | null;
  soundEnabled: boolean;
  seenTamilInfo: string[];
}

const STORAGE_KEY = 'MERGE_MESS_SAVE_V1';

const DEFAULT_SAVE: SaveData = {
  bestScore: 0,
  coins: 50, // Starting gift to try boosts/themes
  unlockedThemes: ['classic-food'],
  activeThemeId: 'classic-food',
  dailyStreak: 0,
  lastDailyDate: null,
  soundEnabled: true,
  seenTamilInfo: []
};

export class StorageService {
  private static cachedData: SaveData | null = null;

  public static load(): SaveData {
    if (this.cachedData) return this.cachedData;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.cachedData = { ...DEFAULT_SAVE, ...JSON.parse(raw) };
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
}

