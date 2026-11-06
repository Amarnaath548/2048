import { Grid, Tile, Direction } from './types.ts';
import { generateTileId } from './spawn.ts';

export interface LineMove {
  id: number;
  fromIdx: number;
  toIdx: number;
}

export interface LineMerge {
  targetIdx: number;
  tier: number;
  value: number;
  newTileId: number;
  sourceIds: [number, number];
}

export interface SlideLineResult {
  line: (Tile | null)[];
  scoreGained: number;
  merges: { tier: number; value: number }[];
  moved: boolean;
  moves: LineMove[];
  mergedTiles: LineMerge[];
}

/**
 * Slides and merges a single line (array of 4 cells) towards index 0.
 * Rule: Two equal tiles that collide merge into next tier, once per move.
 */
export function slideAndMergeLine(line: (Tile | null)[]): SlideLineResult {
  const size = line.length;
  // Keep original line indices with each tile
  const indexedTiles: { tile: Tile; originalIdx: number }[] = [];
  for (let idx = 0; idx < size; idx++) {
    const t = line[idx];
    if (t) {
      indexedTiles.push({ tile: t, originalIdx: idx });
    }
  }

  const newLine: (Tile | null)[] = Array(size).fill(null);
  const merges: { tier: number; value: number }[] = [];
  const moves: LineMove[] = [];
  const mergedTiles: LineMerge[] = [];
  let scoreGained = 0;
  let targetIdx = 0;
  let i = 0;

  while (i < indexedTiles.length) {
    const current = indexedTiles[i];
    if (i + 1 < indexedTiles.length && current.tile.tier === indexedTiles[i + 1].tile.tier) {
      const nextOne = indexedTiles[i + 1];
      const nextTier = current.tile.tier + 1;
      const nextValue = Math.pow(2, nextTier);
      const newId = generateTileId();

      const mergedTile: Tile = {
        id: newId,
        tier: nextTier,
        value: nextValue,
        r: current.tile.r,
        c: current.tile.c,
        isMerged: true
      };

      newLine[targetIdx] = mergedTile;
      scoreGained += nextValue;
      merges.push({ tier: nextTier, value: nextValue });

      moves.push({ id: current.tile.id, fromIdx: current.originalIdx, toIdx: targetIdx });
      moves.push({ id: nextOne.tile.id, fromIdx: nextOne.originalIdx, toIdx: targetIdx });
      mergedTiles.push({
        targetIdx,
        tier: nextTier,
        value: nextValue,
        newTileId: newId,
        sourceIds: [current.tile.id, nextOne.tile.id]
      });

      i += 2; // skip both merged tiles so chain merge is disallowed in single move
    } else {
      newLine[targetIdx] = {
        ...current.tile,
        isMerged: false
      };
      moves.push({ id: current.tile.id, fromIdx: current.originalIdx, toIdx: targetIdx });
      i += 1;
    }
    targetIdx++;
  }

  // Check if line changed (either values changed or moved positions)
  let moved = false;
  for (let j = 0; j < size; j++) {
    const oldTile = line[j];
    const newTile = newLine[j];
    if (!oldTile && !newTile) continue;
    if (!oldTile || !newTile) {
      moved = true;
      break;
    }
    if (oldTile.tier !== newTile.tier || oldTile.id !== newTile.id) {
      moved = true;
      break;
    }
  }

  return { line: newLine, scoreGained, merges, moved, moves, mergedTiles };
}
