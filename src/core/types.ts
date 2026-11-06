export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Tile {
  id: number;
  tier: number; // 1 to 11 (or 12 for Tamil)
  value: number; // 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096...
  r: number;
  c: number;
  isNew?: boolean;
  isMerged?: boolean;
  previousPosition?: { r: number; c: number };
}

export type Grid = (Tile | null)[][];

export interface Order {
  id: string;
  targetTier: number;
  targetCount: number;
  currentCount: number;
  rewardCoins: number;
  rewardScore: number;
  customerName: string;
  customerEmoji: string;
  createdAt: number;
  timeLimitSec?: number;
}

export interface ThemeTier {
  tier: number;
  name: string;
  tamilName?: string;
  pronunciation?: string;
  value: number;
  bgColor: string;
  textColor: string;
  iconSvg?: string;
  symbol: string;
  funFact?: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  tamilName: string;
  description: string;
  unlockCost: number;
  totalTiers: number;
  accentColor: string;
  boardBg: string;
  cellEmptyBg: string;
  tiers: ThemeTier[];
}

export interface TileMoveAnimation {
  id: number;
  fromR: number;
  fromC: number;
  toR: number;
  toC: number;
}

export interface TileMergeAnimation {
  targetR: number;
  targetC: number;
  tier: number;
  value: number;
  newTileId: number;
  sourceTileIds: number[];
}

export interface MoveResult {
  changed: boolean;
  scoreGained: number;
  merges: { tier: number; r: number; c: number }[];
  tripleMerge: boolean;
  spawnedTile: Tile | null;
  gameOver: boolean;
  reachedMaxTier: boolean;
  moves: TileMoveAnimation[];
  mergedTiles: TileMergeAnimation[];
}

export interface BoostState {
  remainingBoosts: number; // Max 2 per run
  boostActive: boolean;
}

export interface GameState {
  grid: Grid;
  score: number;
  bestScore: number;
  coins: number;
  currentThemeId: string;
  activeOrder: Order | null;
  orderCompletedCount: number;
  sambarBoosts: number; // current run available (0-2)
  gameOver: boolean;
  hasWon: boolean;
  continuedAfterWin: boolean;
  moveCount: number;
  isDaily: boolean;
  dailyDateStr?: string;
}

