import { describe, it, expect } from 'vitest';
import {
  checkFreeSpinsTrigger,
  rollFreeSpinsMultiplier,
  createFreeSpinsState,
} from '../freeSpins';

describe('checkFreeSpinsTrigger', () => {
  it('returns 0 for 0 scatters', () => {
    expect(checkFreeSpinsTrigger(0)).toBe(0);
  });

  it('returns 0 for 2 scatters', () => {
    expect(checkFreeSpinsTrigger(2)).toBe(0);
  });

  it('returns 10 for 3 scatters', () => {
    expect(checkFreeSpinsTrigger(3)).toBe(10);
  });

  it('returns 25 for 4 scatters', () => {
    expect(checkFreeSpinsTrigger(4)).toBe(25);
  });

  it('returns 50 for 5 scatters', () => {
    expect(checkFreeSpinsTrigger(5)).toBe(50);
  });

  it('returns 50 for 10 scatters', () => {
    expect(checkFreeSpinsTrigger(10)).toBe(50);
  });
});

describe('rollFreeSpinsMultiplier', () => {
  it('returns 2 or 3', () => {
    const results = new Set<number>();
    for (let i = 0; i < 100; i++) {
      const result = rollFreeSpinsMultiplier();
      expect([2, 3]).toContain(result);
      results.add(result);
    }
    expect(results.size).toBe(2);
  });
});

describe('createFreeSpinsState', () => {
  it('returns correct initial state with given spins', () => {
    const state = createFreeSpinsState(10);
    expect(state).toEqual({
      active: true,
      remaining: 10,
      totalAwarded: 10,
      currentMultiplier: 1,
      totalWin: 0,
    });
  });
});
