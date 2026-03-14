import { useEffect } from 'react';
import { getPixiApp } from '../pixi/PixiApp';
import type { GameScene } from '../pixi/scenes/GameScene';

export function useResize(scene: GameScene | null): void {
  useEffect(() => {
    if (!scene) return;
    const handleResize = () => {
      const app = getPixiApp();
      if (app) scene.resize(app.screen.width, app.screen.height);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scene]);
}
