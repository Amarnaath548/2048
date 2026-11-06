import { Grid, Tile } from './types.ts';
import { SeededRNG } from './rng.ts';

let nextTileId = 1;

export function generateTileId(): number {
  return nextTileId++;
}

export function resetTileIdCounter(start = 1): void {
  nextTileId = start;
}

export function getEmptyCells(grid: Grid): { r: number; c: number }[] {
  const empty: { r: number; c: number }[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!grid[r][c]) {
        empty.push({ r, c });
      }
    }
  }
  return empty;
}

/**
 * Spawns a new tile in a random empty cell.
 * Odds: 90% tier 1 (value 2), 10% tier 2 (value 4).
 */
export function spawnRandomTile(grid: Grid, rng?: SeededRNG): Tile | null {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) return null;

  const randIndex = rng
    ? rng.nextInt(0, emptyCells.length - 1)
    : Math.floor(Math.random() * emptyCells.length);

  const cell = emptyCells[randIndex];
  const roll = rng ? rng.next() : Math.random();
  const tier = roll < 0.9 ? 1 : 2;
  const value = Math.pow(2, tier);

  const newTile: Tile = {
    id: nextTileId++,
    tier,
    value,
    r: cell.r,
    c: cell.c,
    isNew: true
  };

  grid[cell.r][cell.c] = newTile;
  return newTile;
}

