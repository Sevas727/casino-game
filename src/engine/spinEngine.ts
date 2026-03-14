import { calculateScatterPays, countScatters } from './scatterPays';
import { checkFreeSpinsTrigger, rollFreeSpinsMultiplier } from './freeSpins';
import { generateReelResult } from './symbolGenerator';
import type { SpinResult } from './types';

export function executeSpin(bet: number, isFreeSpins: boolean): SpinResult {
  const reels = generateReelResult();
  const wins = calculateScatterPays(reels, bet);
  const { count: scatterCount } = countScatters(reels);
  const freeSpinsAwarded = checkFreeSpinsTrigger(scatterCount);

  let multiplier = 1;
  if (isFreeSpins && wins.length > 0) {
    multiplier = rollFreeSpinsMultiplier();
  }

  const totalWin = wins.reduce((sum, w) => sum + w.winAmount, 0) * multiplier;

  return {
    reels,
    wins: wins.map(w => ({ ...w, winAmount: w.winAmount * multiplier })),
    totalWin,
    scatterCount,
    freeSpinsAwarded,
  };
}
