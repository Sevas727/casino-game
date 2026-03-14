import { describe, it, expect } from 'vitest';
import { GAME_CONFIG, getSymbolConfig, getPayMultiplier } from '../config';
import { SymbolId } from '../types';

describe('GAME_CONFIG', () => {
  it('has 6 cols and 5 rows', () => {
    expect(GAME_CONFIG.cols).toBe(6);
    expect(GAME_CONFIG.rows).toBe(5);
  });

  it('has 13 symbols', () => {
    expect(GAME_CONFIG.symbols).toHaveLength(13);
  });

  it('has correct betOptions', () => {
    expect(GAME_CONFIG.betOptions).toEqual([1, 2, 5, 20, 50, 100]);
  });
});

describe('getSymbolConfig', () => {
  it('returns correct config for a known symbol', () => {
    const config = getSymbolConfig(SymbolId.HIGH1);
    expect(config.id).toBe(SymbolId.HIGH1);
    expect(config.name).toBe('High 1');
    expect(config.weight).toBe(5);
    expect(config.pays.length).toBeGreaterThan(0);
  });

  it('throws for unknown symbol', () => {
    expect(() => getSymbolConfig('unknown' as SymbolId)).toThrow('Unknown symbol id: unknown');
  });
});

describe('getPayMultiplier', () => {
  it('returns 1500x for 25 HIGH1', () => {
    expect(getPayMultiplier(SymbolId.HIGH1, 25)).toBe(1500);
  });

  it('returns 750x for 15 HIGH1', () => {
    expect(getPayMultiplier(SymbolId.HIGH1, 15)).toBe(750);
  });

  it('returns 0 for 6 HIGH1 (below min)', () => {
    expect(getPayMultiplier(SymbolId.HIGH1, 6)).toBe(0);
  });

  it('returns 2x for 8 LOW1', () => {
    expect(getPayMultiplier(SymbolId.LOW1, 8)).toBe(2);
  });

  it('returns 0 for WILD', () => {
    expect(getPayMultiplier(SymbolId.WILD, 10)).toBe(0);
  });
});
