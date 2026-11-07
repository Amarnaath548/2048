import { SaveData } from '../services/storage.ts';

export interface Achievement {
  id: string;
  title: string;
  tamilTitle: string;
  description: string;
  icon: string;
  category: 'dish' | 'order' | 'power' | 'streak';
  rewardCoins: number;
  check: (save: SaveData, context?: Record<string, any>) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Dish Tier Unlocks
  {
    id: 'reach_idli',
    title: 'Idli Initiate',
    tamilTitle: 'இட்லி தொடக்கம்',
    description: 'Merge two rice grains to create a fluffy Idli (Tier 2).',
    icon: '⚪',
    category: 'dish',
    rewardCoins: 10,
    check: (save) => (save.unlockedDishTiers['classic-food'] || []).includes(2)
  },
  {
    id: 'reach_dosa',
    title: 'Crispy Dosa Crafter',
    tamilTitle: 'மொறுமொறு தோசை',
    description: 'Level up to a golden Crispy Dosa (Tier 3).',
    icon: '🥞',
    category: 'dish',
    rewardCoins: 15,
    check: (save) => (save.unlockedDishTiers['classic-food'] || []).includes(3)
  },
  {
    id: 'reach_pongal',
    title: 'Pongal Pot',
    tamilTitle: 'பொங்கல் பானை',
    description: 'Cook up rich Ven Pongal with roasted cashews (Tier 5).',
    icon: '🥣',
    category: 'dish',
    rewardCoins: 25,
    check: (save) => (save.unlockedDishTiers['classic-food'] || []).includes(5)
  },
  {
    id: 'reach_biryani',
    title: 'Biryani Boss',
    tamilTitle: 'பிரியாணி தலைவர்',
    description: 'Reach aromatic Dindigul Biryani (Tier 7 / Value 128)!',
    icon: '🍛',
    category: 'dish',
    rewardCoins: 50,
    check: (save) => (save.unlockedDishTiers['classic-food'] || []).includes(7)
  },
  {
    id: 'reach_thali',
    title: 'Thali Master',
    tamilTitle: 'சாப்பாடு அரசன்',
    description: 'Reach the silver Special Thali with all courses (Tier 8).',
    icon: '🍱',
    category: 'dish',
    rewardCoins: 75,
    check: (save) => (save.unlockedDishTiers['classic-food'] || []).includes(8)
  },
  {
    id: 'reach_leaf',
    title: 'Banana-leaf Virtuoso',
    tamilTitle: 'வாழை இலை விருந்து',
    description: 'Reach the emerald Banana-leaf Meal (Tier 9 / Value 512).',
    icon: '🍃',
    category: 'dish',
    rewardCoins: 100,
    check: (save) => (save.unlockedDishTiers['classic-food'] || []).includes(9)
  },
  {
    id: 'reach_golden_feast',
    title: 'Golden Feast Legend',
    tamilTitle: 'தங்க விருந்து நாயகன்',
    description: 'Reach the ultimate Tier 11 Golden Feast (2048)!',
    icon: '👑',
    category: 'dish',
    rewardCoins: 200,
    check: (save) => (save.unlockedDishTiers['classic-food'] || []).includes(11)
  },
  {
    id: 'reach_tamil_au',
    title: 'Tamil Scholar',
    tamilTitle: 'தமிழ் அறிஞர்',
    description: 'Reach Tier 12 ஔ in Tamil Alphabet mode!',
    icon: '📜',
    category: 'dish',
    rewardCoins: 150,
    check: (save) => (save.unlockedDishTiers['tamil-letters'] || []).includes(12)
  },

  // Customer Orders
  {
    id: 'first_order',
    title: 'First Customer Served',
    tamilTitle: 'முதல் வாடிக்கையாளர்',
    description: 'Complete your very first customer order.',
    icon: '👨🏽‍🍳',
    category: 'order',
    rewardCoins: 20,
    check: (save) => (save.stats.ordersCompleted || 0) >= 1
  },
  {
    id: 'orders_10',
    title: 'Order Maestro',
    tamilTitle: 'கைதேர்ந்த சமையல் கலைஞர்',
    description: 'Complete 10 customer orders successfully.',
    icon: '⭐',
    category: 'order',
    rewardCoins: 50,
    check: (save) => (save.stats.ordersCompleted || 0) >= 10
  },
  {
    id: 'orders_25',
    title: 'Master Caterer',
    tamilTitle: 'பெருவிருந்து மேலாளர்',
    description: 'Serve 25 satisfied customers.',
    icon: '🏆',
    category: 'order',
    rewardCoins: 100,
    check: (save) => (save.stats.ordersCompleted || 0) >= 25
  },

  // Powers & Combos
  {
    id: 'combo_virtuoso',
    title: 'Combo Virtuoso',
    tamilTitle: 'மும்முறை சாதனை',
    description: 'Perform a 3-merge combo in a single swipe.',
    icon: '⚡',
    category: 'power',
    rewardCoins: 30,
    check: (_save, ctx) => Boolean(ctx && ctx.combo)
  },
  {
    id: 'sambar_sorcerer',
    title: 'Sambar Sorcerer',
    tamilTitle: 'சாம்பார் வல்லுநர்',
    description: 'Use the Sambar Boost power-up 5 times.',
    icon: '🍲',
    category: 'power',
    rewardCoins: 35,
    check: (save) => (save.stats.sambarBoostsUsed || 0) >= 5
  },

  // Streak & Collection
  {
    id: 'daily_devotee',
    title: 'Daily Devotee',
    tamilTitle: 'தொடர் வாடிக்கையாளர்',
    description: 'Maintain a 3-day Daily Challenge streak.',
    icon: '🔥',
    category: 'streak',
    rewardCoins: 50,
    check: (save) => (save.dailyStreak || 0) >= 3
  },
  {
    id: 'recipe_collector_7',
    title: 'Gourmet Collector',
    tamilTitle: 'சுவைக் களஞ்சியம்',
    description: 'Unlock 7 dishes in your South Indian Recipe Book.',
    icon: '📖',
    category: 'dish',
    rewardCoins: 75,
    check: (save) => (save.unlockedDishTiers['classic-food'] || []).length >= 7
  }
];

export class AchievementManager {
  /**
   * Evaluates all locked achievements and returns any newly unlocked ones.
   */
  public static checkNewUnlocks(save: SaveData, context?: Record<string, any>): Achievement[] {
    const unlockedIds = new Set(save.unlockedAchievements || []);
    const newlyUnlocked: Achievement[] = [];

    for (const ach of ACHIEVEMENTS) {
      if (!unlockedIds.has(ach.id)) {
        if (ach.check(save, context)) {
          newlyUnlocked.push(ach);
        }
      }
    }

    return newlyUnlocked;
  }
}

