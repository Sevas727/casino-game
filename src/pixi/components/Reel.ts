import { Application, Container, Graphics, Ticker } from 'pixi.js';
import { SymbolView } from './SymbolView';
import type { SymbolId } from '../../engine/types';
import { GAME_CONFIG } from '../../engine/config';
import {
  BUFFER_SYMBOLS,
  easeOutBack,
  getRandomSymbol,
  getSpinConfig,
} from '../animations/ReelSpinAnimation';

export class Reel extends Container {
  public symbols: SymbolView[] = [];
  private _spinning = false;
  private _tickerCb: ((ticker: Ticker) => void) | null = null;
  private _blurOverlay: Graphics | null = null;

  constructor(_colIndex: number) {
    super();
    this.buildSymbols();
  }

  /** Build visible + buffer symbols */
  private buildSymbols(): void {
    // Remove old children
    this.removeChildren();
    this.symbols = [];

    const totalSlots = GAME_CONFIG.rows + BUFFER_SYMBOLS;
    for (let i = 0; i < totalSlots; i++) {
      const sym = new SymbolView(getRandomSymbol());
      // Buffer symbols sit above the visible area (negative y)
      sym.y = (i - BUFFER_SYMBOLS) * SymbolView.HEIGHT;
      this.symbols.push(sym);
      this.addChild(sym);
    }
  }

  /** Set symbols on the visible rows only (rows 0..rows-1 mapped to buffer offset) */
  setSymbols(symbolIds: SymbolId[]): void {
    symbolIds.forEach((id, row) => {
      const idx = row + BUFFER_SYMBOLS;
      if (this.symbols[idx]) this.symbols[idx].setSymbol(id);
    });
  }

  /** Start continuous downward spin using the app ticker */
  startSpin(app: Application): void {
    if (this._spinning) return;
    this._spinning = true;

    const speed = getSpinConfig(false).speed; // initial speed, will be overridden on stop

    // Add blur overlay to simulate motion blur
    this._blurOverlay = new Graphics();
    this._blurOverlay.rect(0, -BUFFER_SYMBOLS * SymbolView.HEIGHT, SymbolView.WIDTH, (GAME_CONFIG.rows + BUFFER_SYMBOLS) * SymbolView.HEIGHT);
    this._blurOverlay.fill({ color: 0x1a0a2e, alpha: 0.3 });
    this.addChild(this._blurOverlay);

    this._tickerCb = (ticker: Ticker) => {
      const delta = ticker.deltaTime; // ~1.0 at 60fps
      const moveAmount = speed * delta;

      // During spinning, make symbols semi-transparent for motion blur feel
      for (const sym of this.symbols) {
        sym.alpha = 0.6;
        sym.y += moveAmount;
      }

      // Wrap symbols that go below visible area
      const bottomLimit = GAME_CONFIG.rows * SymbolView.HEIGHT;
      // Find the topmost symbol to compute where to place wrapped symbol
      for (const sym of this.symbols) {
        if (sym.y >= bottomLimit) {
          // Find the current topmost y
          let minY = Infinity;
          for (const s of this.symbols) {
            if (s !== sym && s.y < minY) minY = s.y;
          }
          sym.y = minY - SymbolView.HEIGHT;
          sym.setSymbol(getRandomSymbol());
        }
      }
    };

    app.ticker.add(this._tickerCb);
  }

  /** Stop spin: set final symbols and animate bounce. Returns promise that resolves when done. */
  stopSpin(
    finalSymbols: SymbolId[],
    turbo: boolean,
    app: Application,
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      // Remove spinning ticker
      if (this._tickerCb) {
        app.ticker.remove(this._tickerCb);
        this._tickerCb = null;
      }
      this._spinning = false;

      // Remove blur overlay
      if (this._blurOverlay) {
        this.removeChild(this._blurOverlay);
        this._blurOverlay.destroy();
        this._blurOverlay = null;
      }
      // Restore symbol alphas
      for (const sym of this.symbols) {
        sym.alpha = 1.0;
      }

      const config = getSpinConfig(turbo);

      // Snap symbols to their final positions with overshoot offset
      // Place visible symbols at their correct rows, buffer symbols above
      const totalSlots = GAME_CONFIG.rows + BUFFER_SYMBOLS;

      // Reassign symbol views: buffer symbols get random, visible get final
      for (let i = 0; i < totalSlots; i++) {
        const sym = this.symbols[i];
        if (i < BUFFER_SYMBOLS) {
          sym.setSymbol(getRandomSymbol());
        } else {
          const row = i - BUFFER_SYMBOLS;
          if (row < finalSymbols.length) {
            sym.setSymbol(finalSymbols[row]);
          }
        }
      }

      // Start positions: overshoot downward by bounce amount
      const targetPositions: number[] = [];
      for (let i = 0; i < totalSlots; i++) {
        const targetY = (i - BUFFER_SYMBOLS) * SymbolView.HEIGHT;
        targetPositions.push(targetY);
        // Start from below target (overshoot)
        this.symbols[i].y = targetY + config.bounce;
      }

      // Animate bounce back using easeOutBack
      const bounceDuration = turbo ? 150 : 300; // ms
      let elapsed = 0;

      const bounceCb = (ticker: Ticker) => {
        elapsed += ticker.deltaMS;
        const t = Math.min(elapsed / bounceDuration, 1);
        const eased = easeOutBack(t);

        for (let i = 0; i < totalSlots; i++) {
          const overshootStart = targetPositions[i] + config.bounce;
          this.symbols[i].y =
            overshootStart + (targetPositions[i] - overshootStart) * eased;
        }

        if (t >= 1) {
          // Snap to exact positions
          for (let i = 0; i < totalSlots; i++) {
            this.symbols[i].y = targetPositions[i];
          }
          app.ticker.remove(bounceCb);
          resolve();
        }
      };

      app.ticker.add(bounceCb);
    });
  }

  /** Immediately snap to final symbols without animation */
  forceSetSymbols(finalSymbols: SymbolId[], app: Application): void {
    // Remove spinning ticker
    if (this._tickerCb) {
      app.ticker.remove(this._tickerCb);
      this._tickerCb = null;
    }
    this._spinning = false;

    // Remove blur overlay
    if (this._blurOverlay) {
      this.removeChild(this._blurOverlay);
      this._blurOverlay.destroy();
      this._blurOverlay = null;
    }
    // Restore symbol alphas
    for (const sym of this.symbols) {
      sym.alpha = 1.0;
    }

    const totalSlots = GAME_CONFIG.rows + BUFFER_SYMBOLS;
    for (let i = 0; i < totalSlots; i++) {
      const sym = this.symbols[i];
      const targetY = (i - BUFFER_SYMBOLS) * SymbolView.HEIGHT;
      sym.y = targetY;
      if (i < BUFFER_SYMBOLS) {
        sym.setSymbol(getRandomSymbol());
      } else {
        const row = i - BUFFER_SYMBOLS;
        if (row < finalSymbols.length) {
          sym.setSymbol(finalSymbols[row]);
        }
      }
    }
  }

  get spinning(): boolean {
    return this._spinning;
  }
}
