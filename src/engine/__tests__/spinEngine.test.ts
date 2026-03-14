import { describe, it, expect } from 'vitest';
import { executeSpin } from '../spinEngine';

describe('executeSpin', () => {
  it('returns valid SpinResult with correct dimensions (6 cols, 5 rows each)', () => {
    const result = executeSpin(1, false);

    expect(result.reels).toHaveLength(6);
    for (const col of result.reels) {
      expect(col).toHaveLength(5);
    }
  });

  it('totalWin is a non-negative number', () => {
    const result = executeSpin(1, false);
    expect(typeof result.totalWin).toBe('number');
    expect(result.totalWin).toBeGreaterThanOrEqual(0);
  });

  it('scatterCount and freeSpinsAwarded are numbers', () => {
    const result = executeSpin(1, false);
    expect(typeof result.scatterCount).toBe('number');
    expect(typeof result.freeSpinsAwarded).toBe('number');
  });

  it('free spins multiplier applied when isFreeSpins=true (statistical)', () => {
    // Run 200 times to statistically get at least one win with multiplier > 1
    let hasMultipliedWin = false;

    for (let i = 0; i < 200; i++) {
      const result = executeSpin(1, true);

      if (result.wins.length > 0) {
        // In free spins mode, a multiplier is rolled. If multiplier > 1,
        // the win amounts will differ from base multiplier * bet.
        // We check that the system at least produces wins during free spins.
        // Since multipliers include values > 1, over 200 runs we should see
        // at least one case where multiplier > 1 is applied.
        for (const win of result.wins) {
          if (win.winAmount > win.multiplier * 1) {
            // winAmount = bet * payMultiplier * freeSpinsMultiplier
            // If freeSpinsMultiplier > 1, winAmount > bet * payMultiplier
            hasMultipliedWin = true;
            break;
          }
        }
      }

      if (hasMultipliedWin) break;
    }

    expect(hasMultipliedWin).toBe(true);
  });
});
