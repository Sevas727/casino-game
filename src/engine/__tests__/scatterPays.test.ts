import { describe, it, expect } from 'vitest';
import { calculateScatterPays, countScatters } from '../scatterPays';
import type { ReelResult } from '../types';
import { SymbolId } from '../types';

/**
 * Creates a 6x5 ReelResult from a flat array of 30 symbols (col-major:
 * first 5 = col 0, next 5 = col 1, etc.)
 */
function makeGrid(flat: SymbolId[]): ReelResult {
  const cols = 6;
  const rows = 5;
  const grid: ReelResult = [];
  for (let c = 0; c < cols; c++) {
    grid.push(flat.slice(c * rows, c * rows + rows));
  }
  return grid;
}

describe('calculateScatterPays', () => {
  it('returns no wins when no symbol has 8+ count', () => {
    // Spread 11 different symbols across 30 positions (no more than 3 each)
    const flat: SymbolId[] = [
      // col 0
      SymbolId.HIGH1, SymbolId.HIGH2, SymbolId.HIGH3, SymbolId.HIGH4, SymbolId.MID1,
      // col 1
      SymbolId.MID2, SymbolId.LOW1, SymbolId.LOW2, SymbolId.LOW3, SymbolId.LOW4,
      // col 2
      SymbolId.LOW5, SymbolId.HIGH1, SymbolId.HIGH2, SymbolId.HIGH3, SymbolId.HIGH4,
      // col 3
      SymbolId.MID1, SymbolId.MID2, SymbolId.LOW1, SymbolId.LOW2, SymbolId.LOW3,
      // col 4
      SymbolId.LOW4, SymbolId.LOW5, SymbolId.HIGH1, SymbolId.HIGH2, SymbolId.HIGH3,
      // col 5
      SymbolId.HIGH4, SymbolId.MID1, SymbolId.MID2, SymbolId.LOW1, SymbolId.LOW2,
    ];
    const grid = makeGrid(flat);
    const wins = calculateScatterPays(grid, 2);
    expect(wins).toHaveLength(0);
  });

  it('detects 8 HIGH1 symbols with correct multiplier and winAmount', () => {
    // Place 8 HIGH1 and fill rest with varied symbols (no other hits 8+)
    const flat: SymbolId[] = [
      // col 0: 5 HIGH1
      SymbolId.HIGH1, SymbolId.HIGH1, SymbolId.HIGH1, SymbolId.HIGH1, SymbolId.HIGH1,
      // col 1: 3 HIGH1
      SymbolId.HIGH1, SymbolId.HIGH1, SymbolId.HIGH1, SymbolId.HIGH2, SymbolId.HIGH3,
      // col 2
      SymbolId.HIGH4, SymbolId.MID1, SymbolId.MID2, SymbolId.LOW1, SymbolId.LOW2,
      // col 3
      SymbolId.LOW3, SymbolId.LOW4, SymbolId.LOW5, SymbolId.HIGH2, SymbolId.HIGH3,
      // col 4
      SymbolId.HIGH4, SymbolId.MID1, SymbolId.MID2, SymbolId.LOW1, SymbolId.LOW2,
      // col 5
      SymbolId.LOW3, SymbolId.LOW4, SymbolId.LOW5, SymbolId.HIGH2, SymbolId.HIGH3,
    ];
    const grid = makeGrid(flat);
    const wins = calculateScatterPays(grid, 2);
    const high1Win = wins.find((w) => w.symbolId === SymbolId.HIGH1);
    expect(high1Win).toBeDefined();
    expect(high1Win!.count).toBe(8);
    expect(high1Win!.multiplier).toBe(2); // from config: 8-12 range = 2
    expect(high1Win!.winAmount).toBe(4); // bet(2) * multiplier(2)
  });

  it('WILD counts toward each symbol type', () => {
    // 6 HIGH1 + 2 WILD = 8 effective HIGH1
    const flat: SymbolId[] = [
      // col 0: 5 HIGH1
      SymbolId.HIGH1, SymbolId.HIGH1, SymbolId.HIGH1, SymbolId.HIGH1, SymbolId.HIGH1,
      // col 1: 1 HIGH1 + 2 WILD + 2 filler
      SymbolId.HIGH1, SymbolId.WILD, SymbolId.WILD, SymbolId.HIGH2, SymbolId.HIGH3,
      // col 2-5: varied non-winning fill
      SymbolId.HIGH4, SymbolId.MID1, SymbolId.MID2, SymbolId.LOW1, SymbolId.LOW2,
      SymbolId.LOW3, SymbolId.LOW4, SymbolId.LOW5, SymbolId.HIGH2, SymbolId.HIGH3,
      SymbolId.HIGH4, SymbolId.MID1, SymbolId.MID2, SymbolId.LOW1, SymbolId.LOW2,
      SymbolId.LOW3, SymbolId.LOW4, SymbolId.LOW5, SymbolId.HIGH2, SymbolId.HIGH3,
    ];
    const grid = makeGrid(flat);
    const wins = calculateScatterPays(grid, 2);
    const high1Win = wins.find((w) => w.symbolId === SymbolId.HIGH1);
    expect(high1Win).toBeDefined();
    expect(high1Win!.count).toBe(8); // 6 HIGH1 + 2 WILD
    expect(high1Win!.multiplier).toBe(2);
    expect(high1Win!.winAmount).toBe(4);
    // positions should include both HIGH1 and WILD positions
    expect(high1Win!.positions).toHaveLength(8);
  });

  it('scatter symbols are not included in scatter pays', () => {
    // Place 10 SCATTER symbols - should NOT trigger a scatter pay
    const flat: SymbolId[] = [
      SymbolId.SCATTER, SymbolId.SCATTER, SymbolId.SCATTER, SymbolId.SCATTER, SymbolId.SCATTER,
      SymbolId.SCATTER, SymbolId.SCATTER, SymbolId.SCATTER, SymbolId.SCATTER, SymbolId.SCATTER,
      SymbolId.HIGH1, SymbolId.HIGH2, SymbolId.HIGH3, SymbolId.HIGH4, SymbolId.MID1,
      SymbolId.MID2, SymbolId.LOW1, SymbolId.LOW2, SymbolId.LOW3, SymbolId.LOW4,
      SymbolId.LOW5, SymbolId.HIGH1, SymbolId.HIGH2, SymbolId.HIGH3, SymbolId.HIGH4,
      SymbolId.MID1, SymbolId.MID2, SymbolId.LOW1, SymbolId.LOW2, SymbolId.LOW3,
    ];
    const grid = makeGrid(flat);
    const wins = calculateScatterPays(grid, 2);
    const scatterWin = wins.find((w) => w.symbolId === SymbolId.SCATTER);
    expect(scatterWin).toBeUndefined();
  });
});

describe('countScatters', () => {
  it('counts and locates all scatter symbols', () => {
    const flat: SymbolId[] = [
      SymbolId.SCATTER, SymbolId.HIGH1, SymbolId.HIGH2, SymbolId.HIGH3, SymbolId.HIGH4,
      SymbolId.MID1, SymbolId.SCATTER, SymbolId.MID2, SymbolId.LOW1, SymbolId.LOW2,
      SymbolId.LOW3, SymbolId.LOW4, SymbolId.SCATTER, SymbolId.LOW5, SymbolId.HIGH1,
      SymbolId.HIGH2, SymbolId.HIGH3, SymbolId.HIGH4, SymbolId.MID1, SymbolId.MID2,
      SymbolId.LOW1, SymbolId.LOW2, SymbolId.LOW3, SymbolId.LOW4, SymbolId.LOW5,
      SymbolId.HIGH1, SymbolId.HIGH2, SymbolId.HIGH3, SymbolId.HIGH4, SymbolId.MID1,
    ];
    const grid = makeGrid(flat);
    const result = countScatters(grid);
    expect(result.count).toBe(3);
    expect(result.positions).toEqual([
      { col: 0, row: 0 },
      { col: 1, row: 1 },
      { col: 2, row: 2 },
    ]);
  });
});
