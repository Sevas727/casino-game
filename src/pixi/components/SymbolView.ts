import { Container, Graphics, Text, Sprite, Ticker } from 'pixi.js';
import { getSymbolTexture, getSymbolColor, getSymbolLabel } from '../utils/assetLoader';
import type { SymbolId } from '../../engine/types';
import { SpineManager } from '../spine/SpineManager';

export class SymbolView extends Container {
  private bg: Graphics;
  private symbolLabel: Text;
  private sprite: Sprite | null = null;
  private _symbolId: SymbolId;
  private winEffect: Container | null = null;

  static readonly WIDTH = 230;
  static readonly HEIGHT = 160;

  constructor(symbolId: SymbolId) {
    super();
    this._symbolId = symbolId;
    this.bg = new Graphics();
    this.symbolLabel = new Text({ text: getSymbolLabel(symbolId), style: { fontSize: 28, fill: 0xffffff, fontWeight: 'bold' } });
    this.symbolLabel.anchor.set(0.5);
    this.symbolLabel.x = SymbolView.WIDTH / 2;
    this.symbolLabel.y = SymbolView.HEIGHT / 2;

    this.addChild(this.bg);
    this.addChild(this.symbolLabel);

    this.applySymbol(symbolId);
  }

  get symbolId(): SymbolId { return this._symbolId; }

  setSymbol(symbolId: SymbolId): void {
    this._symbolId = symbolId;
    this.applySymbol(symbolId);
  }

  private applySymbol(symbolId: SymbolId): void {
    const texture = getSymbolTexture(symbolId);

    if (texture) {
      // Hide fallback graphics and label
      this.bg.clear();
      this.bg.visible = false;
      this.symbolLabel.visible = false;

      // Create or update sprite
      if (this.sprite) {
        this.sprite.texture = texture;
      } else {
        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = SymbolView.WIDTH / 2;
        this.sprite.y = SymbolView.HEIGHT / 2;
        this.addChildAt(this.sprite, 0);
      }

      // Scale sprite proportionally to fit within symbol dimensions
      const scaleX = (SymbolView.WIDTH - 8) / texture.width;
      const scaleY = (SymbolView.HEIGHT - 8) / texture.height;
      const scale = Math.min(scaleX, scaleY);
      this.sprite.scale.set(scale);
      this.sprite.visible = true;
    } else {
      // Fallback to colored rectangle
      if (this.sprite) {
        this.sprite.visible = false;
      }
      this.bg.visible = true;
      this.symbolLabel.visible = true;
      this.bg.clear();
      this.drawSymbol(symbolId);
      this.symbolLabel.text = getSymbolLabel(symbolId);
    }
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
