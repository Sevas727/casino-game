import { Container, Graphics } from 'pixi.js';

// Spine animation will be loaded here when real assets arrive
// For now, provide fallback PixiJS-based animations

export type AnimationName = 'idle' | 'win';

export class SpineManager {
  private static instance: SpineManager;
  private spineAvailable = false;

  static getInstance(): SpineManager {
    if (!SpineManager.instance) SpineManager.instance = new SpineManager();
    return SpineManager.instance;
  }

  async loadSpineAssets(): Promise<void> {
    // TODO: Load real spine assets when available
    // await Assets.load([
    //   { alias: 'adventurer', src: '/assets/spine/adventurer/adventurer.json' },
    //   { alias: 'skull', src: '/assets/spine/skull/skull.json' },
    //   { alias: 'wild', src: '/assets/spine/wild/wild.json' },
    // ]);
    // this.spineAvailable = true;
  }

  isSpineAvailable(): boolean {
    return this.spineAvailable;
  }

  createAnimation(_symbolId: string): Container | null {
    if (this.spineAvailable) {
      // Return real Spine animation
      // return new Spine(Assets.get(symbolId));
    }
    return null; // Fallback to PixiJS animations
  }

  // Fallback: create a simple pulsing/glowing animation using PixiJS
  createFallbackWinEffect(width: number, height: number): Container {
    const container = new Container();
    const glow = new Graphics();
    glow.roundRect(-4, -4, width + 8, height + 8, 14);
    glow.stroke({ color: 0xffd700, width: 3 });
    container.addChild(glow);

    // Animate with ticker-based pulse
    let time = 0;
    const ticker = () => {
      time += 0.05;
      glow.alpha = 0.5 + 0.5 * Math.sin(time);
    };
    (container as any)._winTicker = ticker;

    return container;
  }
}
