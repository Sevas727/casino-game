import { Container, Graphics, Text } from 'pixi.js';

export class Background extends Container {
  constructor() {
    super();
    // Dark green jungle placeholder
    const bg = new Graphics();
    bg.rect(0, 0, 1920, 1080);
    bg.fill({ color: 0x0d3b0d });
    this.addChild(bg);

    // Left totem placeholder
    const leftTotem = new Graphics();
    leftTotem.rect(0, 100, 120, 800);
    leftTotem.fill({ color: 0x5a4a3a });
    this.addChild(leftTotem);

    // Right totem placeholder
    const rightTotem = new Graphics();
    rightTotem.rect(1800, 100, 120, 800);
    rightTotem.fill({ color: 0x5a4a3a });
    this.addChild(rightTotem);

    // Title
    const title = new Text({ text: 'Adventure Fortune', style: { fontSize: 48, fill: 0xffd700, fontWeight: 'bold' } });
    title.anchor.set(0.5, 0);
    title.x = 960;
    title.y = 20;
    this.addChild(title);
  }
}
