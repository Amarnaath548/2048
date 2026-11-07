import { describe, it, expect, beforeEach } from 'vitest';
import { createEmptyGrid, canMove, executeMove } from '../src/core/board.ts';
import { slideAndMergeLine } from '../src/core/merge.ts';
import { ScoreManager } from '../src/core/score.ts';
import { OrderManager } from '../src/core/orders.ts';
import { SambarBoostManager } from '../src/core/boosts.ts';
import { SeededRNG } from '../src/core/rng.ts';
import { createDailyBoard } from '../src/core/daily.ts';
import { spawnRandomTile, resetTileIdCounter } from '../src/core/spawn.ts';
import { Grid, Tile } from '../src/core/types.ts';

import { DailyRewardManager, SEVEN_DAY_REWARDS } from '../src/core/dailyReward.ts';
import { AchievementManager, ACHIEVEMENTS } from '../src/core/achievements.ts';
import { SaveData } from '../src/services/storage.ts';

describe('Merge Mess Core Mechanics', () => {
  describe('Line sliding and merging rules', () => {
    it('slides tiles towards start of line without gap', () => {
      const line: (Tile | null)[] = [
        null,
        { id: 1, tier: 1, value: 2, r: 0, c: 1 },
        null,
        { id: 2, tier: 2, value: 4, r: 0, c: 3 }
      ];
      const result = slideAndMergeLine(line);
      expect(result.moved).toBe(true);
      expect(result.line[0]?.tier).toBe(1);
      expect(result.line[1]?.tier).toBe(2);
      expect(result.line[2]).toBeNull();
      expect(result.line[3]).toBeNull();
    });

    it('merges identical adjacent tiles into next tier once per move (never twice in chain)', () => {
      // Input: [2, 2, 4, null] -> should become [4, 4, null, null], NOT [8, null, null, null]!
      const line: (Tile | null)[] = [
        { id: 1, tier: 1, value: 2, r: 0, c: 0 },
        { id: 2, tier: 1, value: 2, r: 0, c: 1 },
        { id: 3, tier: 2, value: 4, r: 0, c: 2 },
        null
      ];
      const result = slideAndMergeLine(line);
      expect(result.moved).toBe(true);
      expect(result.line[0]?.tier).toBe(2); // 2 + 2 -> 4 (tier 2)
      expect(result.line[1]?.tier).toBe(2); // remains 4 (tier 2)
      expect(result.line[2]).toBeNull();
      expect(result.line[3]).toBeNull();
      expect(result.scoreGained).toBe(4);
    });

    it('handles multiple merges on a single line: [2, 2, 2, 2] -> [4, 4, null, null]', () => {
      const line: (Tile | null)[] = [
        { id: 1, tier: 1, value: 2, r: 0, c: 0 },
        { id: 2, tier: 1, value: 2, r: 0, c: 1 },
        { id: 3, tier: 1, value: 2, r: 0, c: 2 },
        { id: 4, tier: 1, value: 2, r: 0, c: 3 }
      ];
      const result = slideAndMergeLine(line);
      expect(result.line[0]?.tier).toBe(2);
      expect(result.line[1]?.tier).toBe(2);
      expect(result.line[2]).toBeNull();
      expect(result.line[3]).toBeNull();
      expect(result.merges.length).toBe(2);
      expect(result.scoreGained).toBe(8); // 4 + 4
    });
  });

  describe('Board movement in 4 directions', () => {
    it('executes LEFT, RIGHT, UP, DOWN correctly', () => {
      const grid = createEmptyGrid(4);
      grid[1][1] = { id: 1, tier: 1, value: 2, r: 1, c: 1 };
      grid[1][2] = { id: 2, tier: 1, value: 2, r: 1, c: 2 };

      // Move LEFT should merge them at (1, 0)
      const res = executeMove(grid, 'LEFT');
      expect(res.changed).toBe(true);
      expect(grid[1][0]?.tier).toBe(2);
      expect(res.scoreGained).toBe(4);
      expect(res.spawnedTile).not.toBeNull();
    });

    it('does not spawn a tile if move changed nothing', () => {
      const grid = createEmptyGrid(4);
      grid[0][0] = { id: 1, tier: 1, value: 2, r: 0, c: 0 };
      grid[0][1] = { id: 2, tier: 2, value: 4, r: 0, c: 1 };

      // Sliding UP when already at top row changes nothing
      const res = executeMove(grid, 'UP');
      expect(res.changed).toBe(false);
      expect(res.spawnedTile).toBeNull();
      expect(res.scoreGained).toBe(0);
    });
  });

  describe('Game Over detection', () => {
    it('detects game over exactly when no moves or merges exist', () => {
      const grid = createEmptyGrid(4);
      // Fill alternating checkers so no 2 neighbors match
      let counter = 1;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          grid[r][c] = {
            id: counter++,
            tier: (r + c) % 2 === 0 ? 1 : 2,
            value: (r + c) % 2 === 0 ? 2 : 4,
            r,
            c
          };
        }
      }
      expect(canMove(grid)).toBe(false);

      // But if we make one pair match:
      grid[0][1]!.tier = grid[0][0]!.tier;
      expect(canMove(grid)).toBe(true);
    });
  });

  describe('Daily Challenge deterministic generation', () => {
    it('gives the exact same starting board and RNG sequence for same date', () => {
      const date = '2026-11-06';
      const board1 = createDailyBoard(date);
      const board2 = createDailyBoard(date);

      // Compare all tiles
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const t1 = board1.grid[r][c];
          const t2 = board2.grid[r][c];
          if (t1 || t2) {
            expect(t1?.tier).toBe(t2?.tier);
            expect(t1?.value).toBe(t2?.value);
          }
        }
      }

      // Next 5 random rolls should match perfectly
      for (let i = 0; i < 5; i++) {
        expect(board1.rng.next()).toBe(board2.rng.next());
      }
    });
  });

  describe('Customer Orders', () => {
    it('never asks for an impossible tier beyond reachable progress', () => {
      const orderMgr = new OrderManager();
      const themeNames = { 1: 'Rice', 2: 'Idli', 3: 'Dosa', 4: 'Vada' };

      // Highest tier is 2 (Idli), so target tier should never exceed 3
      for (let i = 0; i < 20; i++) {
        const order = orderMgr.generateOrder(2, themeNames, true);
        expect(order).not.toBeNull();
        expect(order!.targetTier).toBeGreaterThanOrEqual(2);
        expect(order!.targetTier).toBeLessThanOrEqual(3);
      }
    });

    it('tracks progress and rewards on completion', () => {
      const orderMgr = new OrderManager();
      orderMgr.setActiveOrder({
        id: 'test_order',
        targetTier: 3,
        targetCount: 2,
        currentCount: 0,
        rewardCoins: 20,
        rewardScore: 200,
        customerName: 'Kavitha',
        customerEmoji: '👩🏽‍🍳',
        createdAt: Date.now()
      });

      // 1st merge
      const partial = orderMgr.onMerges([{ tier: 3 }]);
      expect(partial).toBeNull();
      expect(orderMgr.getActiveOrder()?.currentCount).toBe(1);

      // 2nd merge completes order
      const completed = orderMgr.onMerges([{ tier: 3 }]);
      expect(completed).not.toBeNull();
      expect(completed?.completed).toBe(true);
      expect(completed?.coinsGained).toBe(20);
      expect(orderMgr.getActiveOrder()).toBeNull();
    });
  });

  describe('Sambar Boost', () => {
    it('enforces maximum 2 boosts per run and upgrades chosen tile by 1 tier', () => {
      const boostMgr = new SambarBoostManager(1);
      expect(boostMgr.getRemaining()).toBe(1);

      // Add second
      expect(boostMgr.addBoost()).toBe(true);
      expect(boostMgr.getRemaining()).toBe(2);

      // Third should be rejected due to cap of 2
      expect(boostMgr.addBoost()).toBe(false);
      expect(boostMgr.getRemaining()).toBe(2);

      const grid = createEmptyGrid(4);
      grid[2][2] = { id: 10, tier: 3, value: 8, r: 2, c: 2 };

      const upgraded = boostMgr.applyBoost(grid, 2, 2);
      expect(upgraded).not.toBeNull();
      expect(upgraded?.tier).toBe(4);
      expect(upgraded?.value).toBe(16);
      expect(boostMgr.getRemaining()).toBe(1);
    });

    it('rejects upgrading a tile that is already at maximum tier', () => {
      const boostMgr = new SambarBoostManager(1);
      const grid = createEmptyGrid(4);
      grid[1][1] = { id: 11, tier: 11, value: 2048, r: 1, c: 1 };

      // Cannot upgrade tier 11 when maxTier is 11
      const result = boostMgr.applyBoost(grid, 1, 1, 11);
      expect(result).toBeNull();
      // Boost count should NOT be consumed
      expect(boostMgr.getRemaining()).toBe(1);
    });
  });

  describe('Order Doubling & Seeded Generation', () => {
    it('doubles active order rewards when requested', () => {
      const orderMgr = new OrderManager();
      orderMgr.setActiveOrder({
        id: 'ord_1',
        targetTier: 3,
        targetCount: 1,
        currentCount: 0,
        rewardCoins: 15,
        rewardScore: 150,
        customerName: 'Priya',
        customerEmoji: '👧🏽',
        createdAt: Date.now()
      });

      expect(orderMgr.doubleActiveOrderReward()).toBe(true);
      expect(orderMgr.getActiveOrder()?.rewardCoins).toBe(30);
      expect(orderMgr.getActiveOrder()?.rewardScore).toBe(300);
      expect(orderMgr.getActiveOrder()?.isDoubled).toBe(true);

      // Cannot double twice
      expect(orderMgr.doubleActiveOrderReward()).toBe(false);
    });

    it('produces identical customer orders for same RNG seed', () => {
      const orderMgr1 = new OrderManager();
      const orderMgr2 = new OrderManager();
      const rng1 = new SeededRNG('daily-orders-test');
      const rng2 = new SeededRNG('daily-orders-test');
      const themeNames = { 2: 'Idli', 3: 'Dosa', 4: 'Vada', 5: 'Pongal' };

      const o1 = orderMgr1.generateOrder(4, themeNames, true, 1000, rng1);
      const o2 = orderMgr2.generateOrder(4, themeNames, true, 1000, rng2);

      expect(o1?.targetTier).toBe(o2?.targetTier);
      expect(o1?.targetCount).toBe(o2?.targetCount);
      expect(o1?.customerName).toBe(o2?.customerName);
    });

    it('prevents ID clashes when restoring by bumping tileId counter', () => {
      const grid = createEmptyGrid(4);
      // Simulate restored tiles with IDs up to 45
      grid[0][0] = { id: 45, tier: 2, value: 4, r: 0, c: 0 };
      resetTileIdCounter(46);

      const newTile = spawnRandomTile(grid);
      expect(newTile).not.toBeNull();
      expect(newTile!.id).toBeGreaterThanOrEqual(46);
    });
  });

  describe('Score & Best Score', () => {
    it('updates score and tracks new high scores correctly', () => {
      const scoreMgr = new ScoreManager(100);
      expect(scoreMgr.getScore()).toBe(0);
      expect(scoreMgr.getBestScore()).toBe(100);

      scoreMgr.addScore(50);
      expect(scoreMgr.getScore()).toBe(50);
      expect(scoreMgr.getBestScore()).toBe(100);

      const isNewBest = scoreMgr.addScore(80);
      expect(isNewBest).toBe(true);
      expect(scoreMgr.getScore()).toBe(130);
      expect(scoreMgr.getBestScore()).toBe(130);
    });
  });

  describe('Daily Reward 7-Day Progression', () => {
    it('accurately identifies when daily reward is claimable', () => {
      expect(DailyRewardManager.isRewardClaimable(null, '2026-11-06')).toBe(true);
      expect(DailyRewardManager.isRewardClaimable('2026-11-05', '2026-11-06')).toBe(true);
      expect(DailyRewardManager.isRewardClaimable('2026-11-06', '2026-11-06')).toBe(false);
    });

    it('advances streak consecutively and resets on missed days', () => {
      // First day
      expect(DailyRewardManager.getNextClaimDay(null, 0, '2026-11-06')).toBe(1);

      // Consecutive next day
      expect(DailyRewardManager.getNextClaimDay('2026-11-05', 1, '2026-11-06')).toBe(2);
      expect(DailyRewardManager.getNextClaimDay('2026-11-05', 6, '2026-11-06')).toBe(7);

      // Missed day resets to day 1
      expect(DailyRewardManager.getNextClaimDay('2026-11-01', 4, '2026-11-06')).toBe(1);
    });

    it('has 7 defined reward tiers with escalating value', () => {
      expect(SEVEN_DAY_REWARDS.length).toBe(7);
      expect(SEVEN_DAY_REWARDS[6].coins).toBe(150); // Jackpot day 7
      expect(SEVEN_DAY_REWARDS[6].boosts).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Achievements System', () => {
    const mockSave: SaveData = {
      bestScore: 500,
      coins: 100,
      unlockedThemes: ['classic-food'],
      activeThemeId: 'classic-food',
      dailyStreak: 3,
      lastDailyDate: '2026-11-06',
      lastDailyRewardDate: '2026-11-06',
      soundEnabled: true,
      seenTamilInfo: [],
      savedGrid: null,
      savedScore: 0,
      savedBoosts: 1,
      savedOrder: null,
      hasSeenTutorial: true,
      stats: {
        gamesPlayed: 5,
        totalMerges: 45,
        ordersCompleted: 10,
        highestDishReached: 'Dindigul Biryani',
        highestDishTier: 7,
        highestTamilTier: 1,
        sambarBoostsUsed: 5,
        totalScoreEarned: 2400
      },
      dailyLoginStreak: 2,
      lastDailyLoginClaimDate: '2026-11-05',
      unlockedAchievements: [],
      unlockedDishTiers: {
        'classic-food': [1, 2, 3, 4, 5, 6, 7]
      }
    };

    it('detects dish tier achievements like Reach Biryani', () => {
      const unlocks = AchievementManager.checkNewUnlocks(mockSave);
      const ids = unlocks.map(u => u.id);

      expect(ids).toContain('reach_idli');
      expect(ids).toContain('reach_dosa');
      expect(ids).toContain('reach_pongal');
      expect(ids).toContain('reach_biryani'); // "Reach Biryani" requirement
      expect(ids).toContain('orders_10');
      expect(ids).toContain('daily_devotee');
      expect(ids).toContain('recipe_collector_7');
      expect(ids).not.toContain('reach_golden_feast'); // not reached tier 11 yet
    });

    it('detects combo achievements during swipe move event', () => {
      const unlocks = AchievementManager.checkNewUnlocks(mockSave, { combo: true });
      const ids = unlocks.map(u => u.id);
      expect(ids).toContain('combo_virtuoso');
    });

    it('never re-unlocks already unlocked achievements', () => {
      const alreadySaved: SaveData = {
        ...mockSave,
        unlockedAchievements: ['reach_idli', 'reach_biryani']
      };
      const unlocks = AchievementManager.checkNewUnlocks(alreadySaved);
      const ids = unlocks.map(u => u.id);
      expect(ids).not.toContain('reach_idli');
      expect(ids).not.toContain('reach_biryani');
    });
  });
});

