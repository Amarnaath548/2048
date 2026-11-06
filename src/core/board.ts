import { Grid, Tile, Direction, MoveResult, TileMoveAnimation, TileMergeAnimation } from './types.ts';
import { slideAndMergeLine } from './merge.ts';
import { spawnRandomTile } from './spawn.ts';
import { SeededRNG } from './rng.ts';

export function createEmptyGrid(size = 4): Grid {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map(row =>
    row.map(cell => (cell ? { ...cell } : null))
  );
}

/**
 * Checks if any valid move (adjacent merge or slide into empty cell) is possible.
 */
export function canMove(grid: Grid): boolean {
  // 1. Any empty cell?
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!grid[r][c]) return true;
    }
  }

  // 2. Any adjacent horizontal merges?
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[r][c]?.tier === grid[r][c + 1]?.tier) return true;
    }
  }

  // 3. Any adjacent vertical merges?
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 3; r++) {
      if (grid[r][c]?.tier === grid[r + 1][c]?.tier) return true;
    }
  }

  return false;
}

export function getHighestTier(grid: Grid): number {
  let highest = 1;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const tile = grid[r][c];
      if (tile && tile.tier > highest) {
        highest = tile.tier;
      }
    }
  }
  return highest;
}

/**
 * Executes a move in the given direction.
 * Returns move result including score gained, list of merges, animation moves, etc.
 */
export function executeMove(
  grid: Grid,
  direction: Direction,
  maxTierTarget = 11,
  rng?: SeededRNG
): MoveResult {
  const newGrid = createEmptyGrid(4);
  let movedAny = false;
  let totalScoreGained = 0;
  const allMerges: { tier: number; r: number; c: number }[] = [];
  const moves: TileMoveAnimation[] = [];
  const mergedTiles: TileMergeAnimation[] = [];

  // Reset flags on existing tiles
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c]) {
        grid[r][c]!.isNew = false;
        grid[r][c]!.isMerged = false;
      }
    }
  }

  if (direction === 'LEFT' || direction === 'RIGHT') {
    for (let r = 0; r < 4; r++) {
      let line = [grid[r][0], grid[r][1], grid[r][2], grid[r][3]];
      if (direction === 'RIGHT') line.reverse();

      const result = slideAndMergeLine(line);
      if (result.moved) movedAny = true;
      totalScoreGained += result.scoreGained;

      let finalLine = result.line;
      if (direction === 'RIGHT') finalLine.reverse();

      for (let c = 0; c < 4; c++) {
        const tile = finalLine[c];
        if (tile) {
          tile.r = r;
          tile.c = c;
          if (tile.isMerged) {
            allMerges.push({ tier: tile.tier, r, c });
          }
        }
        newGrid[r][c] = tile;
      }

      // Collect animation paths
      for (const m of result.moves) {
        const fromC = direction === 'RIGHT' ? 3 - m.fromIdx : m.fromIdx;
        const toC = direction === 'RIGHT' ? 3 - m.toIdx : m.toIdx;
        moves.push({
          id: m.id,
          fromR: r,
          fromC,
          toR: r,
          toC
        });
      }

      for (const mg of result.mergedTiles) {
        const targetC = direction === 'RIGHT' ? 3 - mg.targetIdx : mg.targetIdx;
        mergedTiles.push({
          targetR: r,
          targetC,
          tier: mg.tier,
          value: mg.value,
          newTileId: mg.newTileId,
          sourceTileIds: mg.sourceIds
        });
      }
    }
  } else if (direction === 'UP' || direction === 'DOWN') {
    for (let c = 0; c < 4; c++) {
      let line = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
      if (direction === 'DOWN') line.reverse();

      const result = slideAndMergeLine(line);
      if (result.moved) movedAny = true;
      totalScoreGained += result.scoreGained;

      let finalLine = result.line;
      if (direction === 'DOWN') finalLine.reverse();

      for (let r = 0; r < 4; r++) {
        const tile = finalLine[r];
        if (tile) {
          tile.r = r;
          tile.c = c;
          if (tile.isMerged) {
            allMerges.push({ tier: tile.tier, r, c });
          }
        }
        newGrid[r][c] = tile;
      }

      // Collect animation paths
      for (const m of result.moves) {
        const fromR = direction === 'DOWN' ? 3 - m.fromIdx : m.fromIdx;
        const toR = direction === 'DOWN' ? 3 - m.toIdx : m.toIdx;
        moves.push({
          id: m.id,
          fromR,
          fromC: c,
          toR,
          toC: c
        });
      }

      for (const mg of result.mergedTiles) {
        const targetR = direction === 'DOWN' ? 3 - mg.targetIdx : mg.targetIdx;
        mergedTiles.push({
          targetR,
          targetC: c,
          tier: mg.tier,
          value: mg.value,
          newTileId: mg.newTileId,
          sourceTileIds: mg.sourceIds
        });
      }
    }
  }

  // If nothing moved, the board remains untouched and no new tile spawns
  if (!movedAny) {
    return {
      changed: false,
      scoreGained: 0,
      merges: [],
      tripleMerge: false,
      spawnedTile: null,
      gameOver: !canMove(grid),
      reachedMaxTier: false,
      moves: [],
      mergedTiles: []
    };
  }

  // Update original grid in-place
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      grid[r][c] = newGrid[r][c];
    }
  }

  // Rule: spawn 1 new tile after every move that changes the board
  const spawned = spawnRandomTile(grid, rng);

  // Check if target max tier reached
  const reachedMaxTier = allMerges.some(m => m.tier >= maxTierTarget);

  // Check if player achieved a 3-merge combo in one move
  const tripleMerge = allMerges.length >= 3;

  const gameOver = !canMove(grid);

  return {
    changed: true,
    scoreGained: totalScoreGained,
    merges: allMerges,
    tripleMerge,
    spawnedTile: spawned,
    gameOver,
    reachedMaxTier,
    moves,
    mergedTiles
  };
}
