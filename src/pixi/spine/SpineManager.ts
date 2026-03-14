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

  // Fallback: create a dramatic multi-layered golden lightning glow effect
  createFallbackWinEffect(width: number, height: number): Container {
    const container = new Container();
    container.label = 'fallbackWinEffect';

    // Layer 1: Wide outer soft glow
    const outerGlow = new Graphics();
    outerGlow.roundRect(-6, -6, width + 12, height + 12, 18);
    outerGlow.stroke({ color: 0xffa500, width: 8, alpha: 0.3 });
    container.addChild(outerGlow);

    // Layer 2: Secondary outer glow
    const outerGlow2 = new Graphics();
    outerGlow2.roundRect(-3, -3, width + 6, height + 6, 16);
    outerGlow2.stroke({ color: 0xffb800, width: 5, alpha: 0.4 });
    container.addChild(outerGlow2);

    // Layer 3: Main golden border
    const mainBorder = new Graphics();
    mainBorder.roundRect(0, 0, width, height, 14);
    mainBorder.stroke({ color: 0xffd700, width: 4, alpha: 0.95 });
    container.addChild(mainBorder);

    // Layer 4: Inner bright highlight
    const innerGlow = new Graphics();
    innerGlow.roundRect(3, 3, width - 6, height - 6, 12);
    innerGlow.stroke({ color: 0xffec80, width: 2, alpha: 0.8 });
    container.addChild(innerGlow);

    // Layer 5: Core white-hot highlight
    const coreGlow = new Graphics();
    coreGlow.roundRect(5, 5, width - 10, height - 10, 10);
    coreGlow.stroke({ color: 0xfff8dc, width: 1.5, alpha: 0.5 });
    container.addChild(coreGlow);

    // Animate with pulsing lightning effect
    let time = 0;
    let animFrameId: number | undefined;
    const animate = () => {
      time += 0.06;
      const pulse = 0.6 + 0.4 * Math.sin(time * 3);
      const flicker = 0.85 + 0.15 * Math.sin(time * 11 + Math.random() * 0.3);
      const crackle = Math.random() > 0.92 ? 1.3 : 1.0;

      outerGlow.alpha = pulse * 0.35 * flicker * crackle;
      outerGlow2.alpha = pulse * 0.5 * flicker * crackle;
      mainBorder.alpha = (0.8 + 0.2 * Math.sin(time * 4)) * flicker * crackle;
      innerGlow.alpha = pulse * 0.9 * crackle;
      coreGlow.alpha = (0.4 + 0.4 * Math.sin(time * 6)) * flicker * crackle;

      if (container.parent) {
        animFrameId = requestAnimationFrame(animate);
      }
    };
    animFrameId = requestAnimationFrame(animate);

    // Store cleanup reference
    (container as any)._winTicker = () => {
      if (animFrameId !== undefined) {
        cancelAnimationFrame(animFrameId);
      }
    };

    return container;
  }
}
