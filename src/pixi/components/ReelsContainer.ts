import { Application, Container, Graphics } from 'pixi.js';
import { Reel } from './Reel';
import { SymbolView } from './SymbolView';
import { GAME_CONFIG } from '../../engine/config';
import type { ReelResult } from '../../engine/types';
import { getSpinConfig } from '../animations/ReelSpinAnimation';

export class ReelsContainer extends Container {
  public reels: Reel[] = [];

  constructor() {
    super();
    const totalWidth = GAME_CONFIG.cols * SymbolView.WIDTH;
    const totalHeight = GAME_CONFIG.rows * SymbolView.HEIGHT;

    // Center on 1920x1080 game area
    this.x = (1920 - totalWidth) / 2;
    this.y = (1080 - totalHeight) / 2;

    for (let col = 0; col < GAME_CONFIG.cols; col++) {
      const reel = new Reel(col);
      reel.x = col * SymbolView.WIDTH;
      this.reels.push(reel);
      this.addChild(reel);
    }

    // Mask
    const mask = new Graphics();
    mask.rect(0, 0, totalWidth, totalHeight);
    mask.fill({ color: 0xffffff });
    this.addChild(mask);
    this.mask = mask;

    // Frame border
    const frame = new Graphics();
    frame.rect(-4, -4, totalWidth + 8, totalHeight + 8);
    frame.stroke({ color: 0x8b7355, width: 6 });
    this.addChild(frame);
  }

  setReelResult(result: ReelResult): void {
    result.forEach((col, i) => {
      if (this.reels[i]) this.reels[i].setSymbols(col);
    });
  }

  /** Start all reels spinning */
  startSpin(app: Application): void {
    for (const reel of this.reels) {
      reel.startSpin(app);
    }
  }

  /** Stop reels sequentially left-to-right with configurable delay */
  stopReels(
    result: ReelResult,
    app: Application,
    turbo: boolean,
  ): Promise<void> {
    const config = getSpinConfig(turbo);

    return new Promise<void>((resolve) => {
      let stoppedCount = 0;

      this.reels.forEach((reel, index) => {
        const delay = index * config.delayBetweenReels;

        setTimeout(() => {
          const finalSymbols = result[index] || [];
          reel.stopSpin(finalSymbols, turbo, app).then(() => {
            stoppedCount++;
            if (stoppedCount === this.reels.length) {
              resolve();
            }
          });
        }, delay);
      });
    });
  }

  /** Immediately show final result (for STOP button) */
  forceStop(result: ReelResult, app: Application): void {
    this.reels.forEach((reel, index) => {
      const finalSymbols = result[index] || [];
      reel.forceSetSymbols(finalSymbols, app);
    });
  }
}
