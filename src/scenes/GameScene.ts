import Phaser from 'phaser';
import { Grid, Direction, Tile, MoveResult } from '../core/types.ts';
import { createEmptyGrid, cloneGrid, executeMove, canMove } from '../core/board.ts';
import { spawnRandomTile } from '../core/spawn.ts';
import { getTheme } from '../themes/index.ts';
import { AudioService } from '../services/audio.ts';
import { SeededRNG } from '../core/rng.ts';

export interface GameSceneCallbacks {
  onScoreGained: (score: number) => void;
  onMerges: (merges: { tier: number }[]) => void;
  onTripleMerge: () => void;
  onWin: () => void;
  onGameOver: (highestTier: number) => void;
  onBoostUsed: () => void;
}

export interface StartRunConfig {
  themeId: string;
  callbacks: GameSceneCallbacks;
  initialGrid?: Grid;
  rng?: SeededRNG;
}

export class GameScene extends Phaser.Scene {
  private grid: Grid = createEmptyGrid(4);
  private tileContainers: Map<number, Phaser.GameObjects.Container> = new Map();
  private callbacks!: GameSceneCallbacks;

  private themeId = 'classic-food';
  private sambarMode = false;
  private rng?: SeededRNG;
  private isSceneReady = false;
  private pendingRunConfig: StartRunConfig | null = null;

  // Board layout constants
  private readonly BOARD_SIZE = 400;
  private readonly GRID_SIZE = 4;
  private readonly PADDING = 12;
  private readonly GAP = 8;
  private cellSize = 88;

  // Swipe & input buffering
  private pointerDownPos: { x: number; y: number } | null = null;
  private swipeTriggered = false;
  private isAnimating = false;
  private bufferedDirection: Direction | null = null;

  // Background layers
  private bgLayer!: Phaser.GameObjects.Graphics;
  private cellLayer!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'GameScene' });
  }

  public init(data?: Partial<StartRunConfig>): void {
    if (data && data.callbacks) {
      this.pendingRunConfig = data as StartRunConfig;
    }
  }

  public create(): void {
    this.cellSize = (this.BOARD_SIZE - (this.PADDING * 2) - (this.GAP * (this.GRID_SIZE - 1))) / this.GRID_SIZE;

    this.bgLayer = this.add.graphics();
    this.cellLayer = this.add.graphics();

    this.setupInput();
    this.isSceneReady = true;

    if (this.pendingRunConfig) {
      this.startNewRun(this.pendingRunConfig);
      this.pendingRunConfig = null;
    } else {
      this.drawBackgroundGrid();
    }
  }

  public startNewRun(config: StartRunConfig): void {
    if (!this.isSceneReady) {
      this.pendingRunConfig = config;
      return;
    }

    this.themeId = config.themeId;
    this.callbacks = config.callbacks;
    this.rng = config.rng;
    this.bufferedDirection = null;
    this.isAnimating = false;
    this.sambarMode = false;
    this.pointerDownPos = null;
    this.swipeTriggered = false;

    // Kill any active tweens
    this.tweens.killAll();

    // Cleanly destroy all existing tile containers
    this.tileContainers.forEach(container => {
      if (container) {
        container.destroy();
      }
    });
    this.tileContainers.clear();

    // Set fresh board
    if (config.initialGrid) {
      this.grid = cloneGrid(config.initialGrid);
    } else {
      this.grid = createEmptyGrid(4);
      spawnRandomTile(this.grid, this.rng);
      spawnRandomTile(this.grid, this.rng);
    }

    this.drawBackgroundGrid();
    this.renderTilesImmediate();
  }

  public setTheme(themeId: string): void {
    this.themeId = themeId;
    this.drawBackgroundGrid();
    this.renderTilesImmediate();
  }

  public setSambarMode(active: boolean): void {
    this.sambarMode = active;
  }

  public resetBoard(newGrid?: Grid, rng?: SeededRNG): void {
    this.rng = rng;
    this.bufferedDirection = null;
    this.isAnimating = false;
    this.tweens.killAll();

    this.tileContainers.forEach(container => {
      if (container) {
        container.destroy();
      }
    });
    this.tileContainers.clear();

    if (newGrid) {
      this.grid = cloneGrid(newGrid);
    } else {
      this.grid = createEmptyGrid(4);
      spawnRandomTile(this.grid, this.rng);
      spawnRandomTile(this.grid, this.rng);
    }

    this.drawBackgroundGrid();
    this.renderTilesImmediate();
  }

  public getGrid(): Grid {
    return this.grid;
  }

  /**
   * Clears 4 lowest tiles to continue the game after ad revive!
   */
  public continueRevive(): void {
    const tiles: { r: number; c: number; tier: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c]) {
          tiles.push({ r, c, tier: this.grid[r][c]!.tier });
        }
      }
    }

    tiles.sort((a, b) => a.tier - b.tier);
    const toRemove = tiles.slice(0, 4);

    toRemove.forEach(({ r, c }) => {
      const tile = this.grid[r][c];
      if (tile && this.tileContainers.has(tile.id)) {
        const container = this.tileContainers.get(tile.id)!;
        this.tweens.add({
          targets: container,
          alpha: 0,
          scale: 0.2,
          duration: 180,
          ease: 'Cubic.easeIn',
          onComplete: () => {
            container.destroy();
            this.tileContainers.delete(tile.id);
          }
        });
      }
      this.grid[r][c] = null;
    });

    AudioService.playBoost();
  }

  private drawBackgroundGrid(): void {
    const theme = getTheme(this.themeId);

    this.bgLayer.clear();
    this.bgLayer.fillStyle(Phaser.Display.Color.HexStringToColor(theme.boardBg).color, 1);
    this.bgLayer.fillRoundedRect(0, 0, this.BOARD_SIZE, this.BOARD_SIZE, 14);

    this.cellLayer.clear();
    for (let r = 0; r < this.GRID_SIZE; r++) {
      for (let c = 0; c < this.GRID_SIZE; c++) {
        const { x, y } = this.getCellCoords(r, c);
        // Cell shadow
        this.cellLayer.fillStyle(0x000000, 0.08);
        this.cellLayer.fillRoundedRect(x, y + 2, this.cellSize, this.cellSize, 10);
        // Cell body
        this.cellLayer.fillStyle(0x000000, 0.14);
        this.cellLayer.fillRoundedRect(x, y, this.cellSize, this.cellSize, 10);
      }
    }
  }

  private getCellCoords(r: number, c: number): { x: number; y: number } {
    const x = this.PADDING + c * (this.cellSize + this.GAP);
    const y = this.PADDING + r * (this.cellSize + this.GAP);
    return { x, y };
  }

  private setupInput(): void {
    // Instant swipe detection during pointer movement
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.pointerDownPos = { x: pointer.x, y: pointer.y };
      this.swipeTriggered = false;

      if (this.sambarMode) {
        this.handleTileTap(pointer.x, pointer.y);
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.pointerDownPos || this.swipeTriggered || this.sambarMode) return;

      const dx = pointer.x - this.pointerDownPos.x;
      const dy = pointer.y - this.pointerDownPos.y;
      const dist = Math.hypot(dx, dy);

      // Trigger swipe immediately when finger crosses 20px threshold
      if (dist >= 20) {
        this.swipeTriggered = true;
        if (Math.abs(dx) > Math.abs(dy)) {
          this.triggerMove(dx > 0 ? 'RIGHT' : 'LEFT');
        } else {
          this.triggerMove(dy > 0 ? 'DOWN' : 'UP');
        }
      }
    });

    this.input.on('pointerup', () => {
      this.pointerDownPos = null;
      this.swipeTriggered = false;
    });

    // Keyboard support with instant response
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.triggerMove('LEFT');
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.triggerMove('RIGHT');
          break;
        case 'ArrowUp':
        case 'KeyW':
          this.triggerMove('UP');
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.triggerMove('DOWN');
          break;
      }
    });
  }

  private handleTileTap(x: number, y: number): void {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const coords = this.getCellCoords(r, c);
        if (
          x >= coords.x &&
          x <= coords.x + this.cellSize &&
          y >= coords.y &&
          y <= coords.y + this.cellSize
        ) {
          const tile = this.grid[r][c];
          if (tile) {
            tile.tier += 1;
            tile.value = Math.pow(2, tile.tier);
            AudioService.playBoost();
            this.callbacks.onBoostUsed();
            this.setSambarMode(false);
            this.renderTilesImmediate();
            return;
          }
        }
      }
    }
  }

  public triggerMove(direction: Direction): void {
    // If currently animating, buffer the input to execute seamlessly next frame
    if (this.isAnimating) {
      this.bufferedDirection = direction;
      return;
    }

    const result = executeMove(this.grid, direction, 11, this.rng);
    if (!result.changed) {
      return;
    }

    AudioService.playSwipe();
    this.isAnimating = true;

    // Report score gained & merges
    if (result.scoreGained > 0) {
      this.callbacks.onScoreGained(result.scoreGained);
    }
    if (result.merges.length > 0) {
      this.callbacks.onMerges(result.merges);
      const topMerge = Math.max(...result.merges.map(m => m.tier));
      AudioService.playMerge(topMerge);
    }
    if (result.tripleMerge) {
      this.callbacks.onTripleMerge();
    }

    // Play buttery smooth gliding and merging animations
    this.animateMoveResult(result);

    if (result.reachedMaxTier) {
      this.time.delayedCall(220, () => this.callbacks.onWin());
    }

    if (result.gameOver) {
      let highestTier = 1;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (this.grid[r][c] && this.grid[r][c]!.tier > highestTier) {
            highestTier = this.grid[r][c]!.tier;
          }
        }
      }
      this.time.delayedCall(300, () => {
        AudioService.playGameOver();
        this.callbacks.onGameOver(highestTier);
      });
    }
  }

  private animateMoveResult(result: MoveResult): void {
    const SLIDE_DURATION = 110; // Fast and snappy 110ms slide
    const absorbedTileIds = new Set<number>();

    // Mark absorbed source tiles
    for (const mg of result.mergedTiles) {
      for (const srcId of mg.sourceTileIds) {
        absorbedTileIds.add(srcId);
      }
    }

    // Phase 1: Slide all moving tiles to their target cell coordinates
    for (const mv of result.moves) {
      const container = this.tileContainers.get(mv.id);
      if (container) {
        const destCoords = this.getCellCoords(mv.toR, mv.toC);
        this.tweens.add({
          targets: container,
          x: destCoords.x,
          y: destCoords.y,
          duration: SLIDE_DURATION,
          ease: 'Cubic.easeOut'
        });
      }
    }

    // Phase 2: After slide completes (110ms), handle merges and spawn
    this.time.delayedCall(SLIDE_DURATION, () => {
      // 1. Destroy absorbed source containers
      for (const id of absorbedTileIds) {
        const container = this.tileContainers.get(id);
        if (container) {
          container.destroy();
          this.tileContainers.delete(id);
        }
      }

      // 2. Create newly merged tiles with delicious bounce & particles
      for (const mg of result.mergedTiles) {
        const tileData: Tile = {
          id: mg.newTileId,
          tier: mg.tier,
          value: mg.value,
          r: mg.targetR,
          c: mg.targetC,
          isMerged: true
        };

        const mergedContainer = this.createTileGameObject(tileData, mg.targetR, mg.targetC);
        this.tileContainers.set(mg.newTileId, mergedContainer);

        // Juice: Pop scale from 0.85 -> 1.2 -> 1.0
        mergedContainer.setScale(0.85);
        this.tweens.add({
          targets: mergedContainer,
          scale: 1.18,
          duration: 75,
          yoyo: true,
          ease: 'Back.easeOut'
        });

        // Floating score popup (+value)
        this.spawnFloatingScore(
          mergedContainer.x + this.cellSize / 2,
          mergedContainer.y,
          mg.value
        );

        // Particle burst
        this.spawnMergeParticles(
          mergedContainer.x + this.cellSize / 2,
          mergedContainer.y + this.cellSize / 2
        );
      }

      // 3. Spawn new tile with smooth scale-up
      if (result.spawnedTile) {
        const spawnedContainer = this.createTileGameObject(
          result.spawnedTile,
          result.spawnedTile.r,
          result.spawnedTile.c
        );
        this.tileContainers.set(result.spawnedTile.id, spawnedContainer);

        spawnedContainer.setScale(0);
        this.tweens.add({
          targets: spawnedContainer,
          scale: 1,
          duration: 110,
          ease: 'Back.easeOut'
        });
      }

      // End animation lock
      this.isAnimating = false;

      // If user queued an input during the slide, process it immediately!
      if (this.bufferedDirection) {
        const nextDir = this.bufferedDirection;
        this.bufferedDirection = null;
        this.triggerMove(nextDir);
      }
    });
  }

  private renderTilesImmediate(): void {
    this.tileContainers.forEach(c => c.destroy());
    this.tileContainers.clear();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const tile = this.grid[r][c];
        if (tile) {
          const container = this.createTileGameObject(tile, r, c);
          this.tileContainers.set(tile.id, container);
        }
      }
    }
  }

  private createTileGameObject(tile: Tile, r: number, c: number): Phaser.GameObjects.Container {
    const { x, y } = this.getCellCoords(r, c);
    const theme = getTheme(this.themeId);
    const tierDef = theme.tiers.find(t => t.tier === tile.tier) || theme.tiers[0];

    const container = this.add.container(x, y);

    // Drop shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.15);
    shadow.fillRoundedRect(0, 3, this.cellSize, this.cellSize, 10);
    container.add(shadow);

    // Tile body
    const bg = this.add.graphics();
    const color = Phaser.Display.Color.HexStringToColor(tierDef.bgColor).color;
    bg.fillStyle(color, 1);
    bg.fillRoundedRect(0, 0, this.cellSize, this.cellSize, 10);

    // Subtle 3D bevel / bottom shading
    bg.fillStyle(0x000000, 0.09);
    bg.fillRoundedRect(0, this.cellSize - 5, this.cellSize, 5, { tl: 0, tr: 0, bl: 10, br: 10 });

    container.add(bg);

    // Center Symbol / Emoji
    const isTamilTheme = this.themeId === 'tamil-letters';
    const symbolText = this.add.text(
      this.cellSize / 2,
      isTamilTheme ? this.cellSize / 2 - 5 : this.cellSize / 2 - 7,
      tierDef.symbol,
      {
        fontFamily: isTamilTheme ? 'Noto Sans Tamil' : 'Fredoka, sans-serif',
        fontSize: isTamilTheme ? '38px' : '32px',
        fontStyle: 'bold',
        color: tierDef.textColor,
        align: 'center'
      }
    ).setOrigin(0.5);
    container.add(symbolText);

    // Subtitle label
    const labelStr = isTamilTheme
      ? (tierDef.pronunciation?.split(' ')[0] || tierDef.name)
      : tierDef.name;

    const labelText = this.add.text(
      this.cellSize / 2,
      this.cellSize - 13,
      labelStr,
      {
        fontFamily: isTamilTheme ? 'Noto Sans Tamil, sans-serif' : 'Plus Jakarta Sans, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: tierDef.textColor,
        align: 'center'
      }
    ).setOrigin(0.5);
    container.add(labelText);

    // Small numerical badge
    const valText = this.add.text(
      this.cellSize - 7,
      7,
      String(tile.value),
      {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: tierDef.textColor
      }
    ).setOrigin(1, 0);
    container.add(valText);

    return container;
  }

  private spawnFloatingScore(x: number, y: number, score: number): void {
    const text = this.add.text(x, y, `+${score}`, {
      fontFamily: 'Fredoka, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ea580c',
      stroke: '#ffffff',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      y: y - 28,
      alpha: 0,
      scale: 1.25,
      duration: 400,
      ease: 'Cubic.easeOut',
      onComplete: () => text.destroy()
    });
  }

  private spawnMergeParticles(x: number, y: number): void {
    const emitter = this.add.particles(x, y, undefined as any, {
      speed: { min: 50, max: 130 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 260,
      quantity: 8
    });

    this.time.delayedCall(280, () => emitter.destroy());
  }
}
