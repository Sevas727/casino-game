import { Container, Sprite, type Application } from 'pixi.js';
import { Background } from '../components/Background';
import { ReelsContainer } from '../components/ReelsContainer';
import { getTexture } from '../utils/assetLoader';
import { SymbolView } from '../components/SymbolView';
import { GAME_CONFIG } from '../../engine/config';

export class GameScene {
  public stage: Container;
  public backgroundLayer: Container;
  public reelsLayer: Container;
  public winLayer: Container;
  public overlayLayer: Container;
  public reelsContainer: ReelsContainer;

  private app: Application;

  constructor(app: Application) {
    this.app = app;
    this.stage = new Container();
    this.backgroundLayer = new Container();
    this.reelsLayer = new Container();
    this.winLayer = new Container();
    this.overlayLayer = new Container();

    this.stage.addChild(this.backgroundLayer);
    this.stage.addChild(this.reelsLayer);
    this.stage.addChild(this.winLayer);
    this.stage.addChild(this.overlayLayer);

    // Background
    const background = new Background();
    this.backgroundLayer.addChild(background);

    // Frame behind reels — decorative stone border with column dividers
    const frameTexture = getTexture('frame');
    this.reelsContainer = new ReelsContainer();

    if (frameTexture) {
      const totalWidth = GAME_CONFIG.cols * SymbolView.WIDTH;
      const totalHeight = GAME_CONFIG.rows * SymbolView.HEIGHT;
      const frameSprite = new Sprite(frameTexture);
      const padX = 282;
      const padY = 80;
      frameSprite.x = this.reelsContainer.x - padX;
      frameSprite.y = this.reelsContainer.y - padY;
      frameSprite.width = totalWidth + padX * 2;
      frameSprite.height = totalHeight + padY * 2;
      this.reelsLayer.addChild(frameSprite);
    }

    this.reelsLayer.addChild(this.reelsContainer);

    this.app.stage.addChild(this.stage);
  }

  resize(width: number, height: number): void {
    const gameWidth = 1920;
    const gameHeight = 1080;

    // Reserve space for bottom bar UI overlay
    const isMobile = width <= 768;
    const barHeight = isMobile ? 56 : 90;
    const availableHeight = height - barHeight;
    const scale = Math.min(width / gameWidth, availableHeight / gameHeight);
    this.stage.scale.set(scale);
    this.stage.x = (width - gameWidth * scale) / 2;

    this.stage.y = (availableHeight - gameHeight * scale) / 2;
  }

  destroy(): void { this.stage.destroy({ children: true }); }
}
