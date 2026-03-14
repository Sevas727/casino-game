import { describe, it, expect } from 'vitest';
import { generateReelResult } from '../symbolGenerator';
import { SymbolId } from '../types';

const validSymbolIds = Object.values(SymbolId);

describe('generateReelResult', () => {
  it('returns 6 cols x 5 rows grid', () => {
    const result = generateReelResult();
    expect(result).toHaveLength(6);
    for (const col of result) {
      expect(col).toHaveLength(5);
    }
  });

  it('only contains valid SymbolId values', () => {
    const result = generateReelResult();
    for (const col of result) {
      for (const symbol of col) {
        expect(validSymbolIds).toContain(symbol);
      }
    }
  });

  it('produces different results on multiple calls', () => {
    const results = Array.from({ length: 10 }, () => generateReelResult());
    const serialized = results.map(r => JSON.stringify(r));
    const unique = new Set(serialized);
    expect(unique.size).toBeGreaterThan(1);
  });
});
