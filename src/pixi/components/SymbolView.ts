import { Container, Graphics, Text, Ticker } from 'pixi.js';
import { getSymbolColor, getSymbolLabel } from '../utils/assetLoader';
import type { SymbolId } from '../../engine/types';
import { SpineManager } from '../spine/SpineManager';

export class SymbolView extends Container {
  private bg: Graphics;
  private label: Text;
  private _symbolId: SymbolId;
  private winEffect: Container | null = null;

  static readonly WIDTH = 230;
  static readonly HEIGHT = 160;

  constructor(symbolId: SymbolId) {
    super();
    this._symbolId = symbolId;
    this.bg = new Graphics();
    this.drawSymbol(symbolId);
    this.addChild(this.bg);

    this.label = new Text({ text: getSymbolLabel(symbolId), style: { fontSize: 28, fill: 0xffffff, fontWeight: 'bold' } });
    this.label.anchor.set(0.5);
    this.label.x = SymbolView.WIDTH / 2;
    this.label.y = SymbolView.HEIGHT / 2;
    this.addChild(this.label);
  }

  get symbolId(): SymbolId { return this._symbolId; }

  setSymbol(symbolId: SymbolId): void {
    this._symbolId = symbolId;
    this.bg.clear();
    this.drawSymbol(symbolId);
    this.label.text = getSymbolLabel(symbolId);
  }

  private drawSymbol(symbolId: SymbolId): void {
    const color = getSymbolColor(symbolId);
    this.bg.roundRect(4, 4, SymbolView.WIDTH - 8, SymbolView.HEIGHT - 8, 12);
    this.bg.fill({ color });
    this.bg.stroke({ color: 0x333333, width: 2 });
  }

  /** Play a win animation on this symbol (Spine when available, fallback glow otherwise). */
  playWinAnimation(): void {
    if (this.winEffect) return; // already playing

    const spine = SpineManager.getInstance();
    const spineAnim = spine.createAnimation(this._symbolId);

    if (spineAnim) {
      this.winEffect = spineAnim;
    } else {
      this.winEffect = spine.createFallbackWinEffect(SymbolView.WIDTH, SymbolView.HEIGHT);
      const ticker = (this.winEffect as any)._winTicker as ((dt: any) => void) | undefined;
      if (ticker) {
        Ticker.shared.add(ticker);
      }
    }

    this.addChild(this.winEffect);
  }

  /** Stop and remove the win animation from this symbol. */
  stopWinAnimation(): void {
    if (!this.winEffect) return;

    const ticker = (this.winEffect as any)._winTicker as ((dt: any) => void) | undefined;
    if (ticker) {
      Ticker.shared.remove(ticker);
    }

    this.removeChild(this.winEffect);
    this.winEffect.destroy({ children: true });
    this.winEffect = null;
  }
}
