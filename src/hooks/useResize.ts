import { useEffect, useCallback } from 'react';
import { getPixiApp } from '../pixi/PixiApp';
import type { GameScene } from '../pixi/scenes/GameScene';

export function useResize(scene: GameScene | null): void {
  const handleResize = useCallback(() => {
    if (!scene) return;
    const app = getPixiApp();
    if (!app) return;
    scene.resize(app.screen.width, app.screen.height);
  }, [scene]);

  useEffect(() => {
    if (!scene) return;

    let timeoutId: number;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, 100);
    };

    handleResize();
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', () => {
      // Small delay to let browser finish orientation change
      setTimeout(handleResize, 200);
    });

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [scene, handleResize]);
}
