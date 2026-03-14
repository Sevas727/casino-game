import { FreeSpinsState } from './types';
import { GAME_CONFIG } from './config';
import { randomInt } from './rng';

export function checkFreeSpinsTrigger(scatterCount: number): number {
  const triggers = [...GAME_CONFIG.freeSpinsTrigger].sort(
    (a, b) => b.count - a.count,
  );
  for (const trigger of triggers) {
    if (scatterCount >= trigger.count) {
      return trigger.spins;
    }
  }
  return 0;
}

export function rollFreeSpinsMultiplier(): number {
  const multipliers = GAME_CONFIG.freeSpinsMultipliers;
  const index = randomInt(0, multipliers.length - 1);
  return multipliers[index];
}

export function createFreeSpinsState(spins: number): FreeSpinsState {
  return {
    active: true,
    remaining: spins,
    totalAwarded: spins,
    currentMultiplier: 1,
    totalWin: 0,
  };
}
