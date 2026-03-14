import { Container, Graphics } from 'pixi.js';
import { Reel } from './Reel';
import { SymbolView } from './SymbolView';
import { GAME_CONFIG } from '../../engine/config';
import type { ReelResult } from '../../engine/types';

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
    result.forEach((col, i) => { if (this.reels[i]) this.reels[i].setSymbols(col); });
  }
}
