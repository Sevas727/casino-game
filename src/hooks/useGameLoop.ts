import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectGameState,
  selectBet,
  selectFreeSpins,
  setResult,
  winAnimationComplete,
} from '../store/gameSlice';
import { selectTurboMode } from '../store/settingsSlice';
import { executeSpin } from '../engine/spinEngine';
import { getPixiApp } from '../pixi/PixiApp';
import type { GameScene } from '../pixi/scenes/GameScene';
import type { GameState } from '../engine/types';

export function useGameLoop(scene: GameScene | null): void {
  const dispatch = useDispatch();
  const gameState = useSelector(selectGameState);
  const bet = useSelector(selectBet);
  const freeSpins = useSelector(selectFreeSpins);
  const turbo = useSelector(selectTurboMode);
  const prevGameState = useRef<GameState>(gameState);

  useEffect(() => {
    if (!scene) return;
    const app = getPixiApp();
    if (!app) return;

    if (prevGameState.current !== gameState) {
      const prev = prevGameState.current;
      prevGameState.current = gameState;

      if (gameState === 'spinning' && prev === 'idle') {
        // Start reel spin animation
        const reelsContainer = scene.reelsContainer;
        reelsContainer.startSpin(app);

        // Generate result from engine
        const result = executeSpin(bet, freeSpins.active);

        // Minimum spin time for visual effect
        const minTime = turbo ? 200 : 500;

        setTimeout(async () => {
          await reelsContainer.stopReels(result.reels, app, turbo);
          dispatch(setResult(result));
        }, minTime);
      }

      if (gameState === 'showing-win') {
        const winDuration = turbo ? 1000 : 2000;
        setTimeout(() => {
          dispatch(winAnimationComplete());
        }, winDuration);
      }
    }
  }, [gameState, scene, dispatch, bet, freeSpins, turbo]);
}
