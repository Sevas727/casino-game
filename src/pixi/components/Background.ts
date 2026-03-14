import { Container, Graphics, Text, Sprite } from 'pixi.js';
import { getTexture } from '../utils/assetLoader';

export class Background extends Container {
  constructor() {
    super();

    // Background image or fallback
    const bgTexture = getTexture('background');
    if (bgTexture) {
      const bgSprite = new Sprite(bgTexture);
      bgSprite.width = 1920;
      bgSprite.height = 1080;
      this.addChild(bgSprite);
    } else {
      const bg = new Graphics();
      bg.rect(0, 0, 1920, 1080);
      bg.fill({ color: 0x0d3b0d });
      this.addChild(bg);
    }

    // Left totem
    const leftTotemTexture = getTexture('totem_left');
    if (leftTotemTexture) {
      const leftTotem = new Sprite(leftTotemTexture);
      // Scale to fit roughly the totem area
      const totemScale = 800 / leftTotemTexture.height;
      leftTotem.scale.set(totemScale);
      leftTotem.x = 0;
      leftTotem.y = 100;
      this.addChild(leftTotem);
    } else {
      const leftTotem = new Graphics();
      leftTotem.rect(0, 100, 120, 800);
      leftTotem.fill({ color: 0x5a4a3a });
      this.addChild(leftTotem);
    }

    // Right totem
    const rightTotemTexture = getTexture('totem_right');
    if (rightTotemTexture) {
      const rightTotem = new Sprite(rightTotemTexture);
      const totemScale = 800 / rightTotemTexture.height;
      rightTotem.scale.set(totemScale);
      rightTotem.anchor.set(1, 0);
      rightTotem.x = 1920;
      rightTotem.y = 100;
      this.addChild(rightTotem);
    } else {
      const rightTotem = new Graphics();
      rightTotem.rect(1800, 100, 120, 800);
      rightTotem.fill({ color: 0x5a4a3a });
      this.addChild(rightTotem);
    }

    // Logo or title text
    const logoTexture = getTexture('logo');
    if (logoTexture) {
      const logo = new Sprite(logoTexture);
      logo.anchor.set(0.5, 0);
      // Scale logo to reasonable size
      const logoScale = Math.min(400 / logoTexture.width, 100 / logoTexture.height);
      logo.scale.set(logoScale);
      logo.x = 960;
      logo.y = 10;
      this.addChild(logo);
    } else {
      const title = new Text({ text: 'Adventure Fortune', style: { fontSize: 48, fill: 0xffd700, fontWeight: 'bold' } });
      title.anchor.set(0.5, 0);
      title.x = 960;
      title.y = 20;
      this.addChild(title);
    }
  }
}
