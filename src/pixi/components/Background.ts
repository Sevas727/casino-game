import { Container, Graphics, Text, Sprite } from 'pixi.js';
import { getTexture } from '../utils/assetLoader';

export class Background extends Container {
  constructor() {
    super();

    // Solid fill behind everything
    const solidBg = new Graphics();
    solidBg.rect(0, 0, 1920, 1080);
    solidBg.fill({ color: 0x1a0a2e });
    this.addChild(solidBg);

    // Background image (opaque jungle scene)
    const bgTexture = getTexture('background');
    if (bgTexture) {
      const bgSprite = new Sprite(bgTexture);
      bgSprite.width = 1920;
      bgSprite.height = 1080;
      this.addChild(bgSprite);

      // Cover Gemini AI watermark in bottom-right corner
      const watermarkCover = new Graphics();
      watermarkCover.rect(1875, 1045, 50, 40);
      watermarkCover.fill({ color: 0x2a4a1a });
      this.addChild(watermarkCover);
    } else {
      const bg = new Graphics();
      bg.rect(0, 0, 1920, 1080);
      bg.fill({ color: 0x0d3b0d });
      this.addChild(bg);
    }

    // Skip totem sprites - they have checkerboard baked into their transparent areas.
    // The background image already contains integrated pillar/vegetation art.

    // Logo
    const logoTexture = getTexture('logo');
    if (logoTexture) {
      const logo = new Sprite(logoTexture);
      logo.anchor.set(0.5, 0);
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
