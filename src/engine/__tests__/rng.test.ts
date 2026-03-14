import { describe, it, expect } from 'vitest';
import { randomInt, pickWeighted } from '../rng';

describe('randomInt', () => {
  it('returns number within range (loop 100 times)', () => {
    for (let i = 0; i < 100; i++) {
      const result = randomInt(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    }
  });
});

describe('pickWeighted', () => {
  it('picks item with weight 100 over item with weight 0', () => {
    const items = [
      { value: 'never', weight: 0 },
      { value: 'always', weight: 100 },
    ];
    for (let i = 0; i < 50; i++) {
      expect(pickWeighted(items)).toBe('always');
    }
  });
});
