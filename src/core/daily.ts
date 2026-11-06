import { Grid } from './types.ts';
import { SeededRNG } from './rng.ts';
import { createEmptyGrid } from './board.ts';
import { spawnRandomTile } from './spawn.ts';

export function getTodayDateString(d = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function createDailyBoard(dateStr: string): { grid: Grid; rng: SeededRNG } {
  const rng = new SeededRNG(`merge-mess-daily-${dateStr}`);
  const grid = createEmptyGrid(4);

  // Spawn exactly 2 initial tiles deterministically
  spawnRandomTile(grid, rng);
  spawnRandomTile(grid, rng);

  return { grid, rng };
}

export function calculateNewStreak(
  lastPlayedDateStr: string | null,
  currentStreak: number,
  todayDateStr: string
): { streak: number; isConsecutive: boolean } {
  if (!lastPlayedDateStr) {
    return { streak: 1, isConsecutive: true };
  }

  if (lastPlayedDateStr === todayDateStr) {
    // Already played today
    return { streak: currentStreak, isConsecutive: true };
  }

  const lastDate = new Date(lastPlayedDateStr);
  const today = new Date(todayDateStr);
  const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 1) {
    return { streak: currentStreak + 1, isConsecutive: true };
  } else {
    // Missed a day or more, streak resets to 1
    return { streak: 1, isConsecutive: false };
  }
}

