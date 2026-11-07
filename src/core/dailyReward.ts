export interface DailyRewardTier {
  day: number;
  label: string;
  coins: number;
  boosts: number;
  icon: string;
  title: string;
  description: string;
}

export const SEVEN_DAY_REWARDS: DailyRewardTier[] = [
  {
    day: 1,
    label: 'Day 1',
    coins: 20,
    boosts: 0,
    icon: '🪙',
    title: 'Welcome Gift',
    description: '+20 Coins to start your kitchen shift!'
  },
  {
    day: 2,
    label: 'Day 2',
    coins: 35,
    boosts: 0,
    icon: '🪙',
    title: 'Prep Cook',
    description: '+35 Coins for your hard work!'
  },
  {
    day: 3,
    label: 'Day 3',
    coins: 25,
    boosts: 1,
    icon: '🍲',
    title: 'Sambar Special',
    description: '+25 Coins & +1 Sambar Boost Power-up!'
  },
  {
    day: 4,
    label: 'Day 4',
    coins: 50,
    boosts: 0,
    icon: '🪙',
    title: 'Sous Chef',
    description: '+50 Coins for steady dedication!'
  },
  {
    day: 5,
    label: 'Day 5',
    coins: 75,
    boosts: 0,
    icon: '💰',
    title: 'Spice Master',
    description: '+75 Coins to unlock new skins!'
  },
  {
    day: 6,
    label: 'Day 6',
    coins: 40,
    boosts: 2,
    icon: '🍲🍲',
    title: 'Double Ladle',
    description: '+40 Coins & +2 Sambar Boosts!'
  },
  {
    day: 7,
    label: 'Day 7',
    coins: 150,
    boosts: 1,
    icon: '👑',
    title: 'Grand Feast Day',
    description: 'JACKPOT! +150 Coins & +1 Sambar Boost!'
  }
];

export class DailyRewardManager {
  /**
   * Check whether today's login reward is claimable.
   */
  public static isRewardClaimable(lastClaimDate: string | null, todayDateStr: string): boolean {
    return lastClaimDate !== todayDateStr;
  }

  /**
   * Calculates what day number (1..7) is next, handling streaks & missed days.
   */
  public static getNextClaimDay(
    lastClaimDate: string | null,
    currentStreak: number,
    todayDateStr: string
  ): number {
    if (!lastClaimDate) {
      return 1;
    }

    if (lastClaimDate === todayDateStr) {
      // Already claimed today
      return currentStreak > 0 ? ((currentStreak - 1) % 7) + 1 : 1;
    }

    const lastTime = new Date(lastClaimDate).getTime();
    const todayTime = new Date(todayDateStr).getTime();
    const diffDays = Math.round((todayTime - lastTime) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day!
      return (currentStreak % 7) + 1;
    } else {
      // Missed one or more days, restart at Day 1
      return 1;
    }
  }
}

