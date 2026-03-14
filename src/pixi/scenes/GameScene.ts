import { Container, type Application } from 'pixi.js';

export class GameScene {
  public stage: Container;
  public backgroundLayer: Container;
  public reelsLayer: Container;
  public winLayer: Container;
  public overlayLayer: Container;

  constructor(private app: Application) {
    this.stage = new Container();
    this.backgroundLayer = new Container();
    this.reelsLayer = new Container();
    this.winLayer = new Container();
    this.overlayLayer = new Container();

    this.stage.addChild(this.backgroundLayer);
    this.stage.addChild(this.reelsLayer);
    this.stage.addChild(this.winLayer);
    this.stage.addChild(this.overlayLayer);

    this.app.stage.addChild(this.stage);
  }

  resize(width: number, height: number): void {
    const gameWidth = 1920;
    const gameHeight = 1080;
    const scale = Math.min(width / gameWidth, height / gameHeight);
    this.stage.scale.set(scale);
    this.stage.x = (width - gameWidth * scale) / 2;
    this.stage.y = (height - gameHeight * scale) / 2;
  }

  destroy(): void { this.stage.destroy({ children: true }); }
}
