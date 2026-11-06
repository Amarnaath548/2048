export class ScoreManager {
  private currentScore = 0;
  private bestScore = 0;

  constructor(initialBest = 0) {
    this.bestScore = initialBest;
  }

  public getScore(): number {
    return this.currentScore;
  }

  public getBestScore(): number {
    return this.bestScore;
  }

  public addScore(points: number): boolean {
    this.currentScore += points;
    if (this.currentScore > this.bestScore) {
      this.bestScore = this.currentScore;
      return true; // new high score!
    }
    return false;
  }

  public reset(score = 0): void {
    this.currentScore = score;
  }

  public setBestScore(best: number): void {
    if (best > this.bestScore) {
      this.bestScore = best;
    }
  }
}

