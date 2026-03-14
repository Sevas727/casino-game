import type { ReelResult, WinResult } from './types';
import { SymbolId } from './types';
import { getPayMultiplier } from './config';

export function calculateScatterPays(reels: ReelResult, bet: number): WinResult[] {
  const cols = reels.length;
  const rows = reels[0]?.length ?? 0;

  // Count each symbol and track positions
  const symbolCounts = new Map<SymbolId, number>();
  const symbolPositions = new Map<SymbolId, { col: number; row: number }[]>();
  const wildPositions: { col: number; row: number }[] = [];
  let wildCount = 0;

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const symbol = reels[col][row];
      if (symbol === SymbolId.WILD) {
        wildCount++;
        wildPositions.push({ col, row });
      } else {
        symbolCounts.set(symbol, (symbolCounts.get(symbol) ?? 0) + 1);
        const positions = symbolPositions.get(symbol) ?? [];
        positions.push({ col, row });
        symbolPositions.set(symbol, positions);
      }
    }
  }

  const wins: WinResult[] = [];

  for (const [symbolId, count] of symbolCounts) {
    if (symbolId === SymbolId.SCATTER) continue;

    const effectiveCount = count + wildCount;
    const multiplier = getPayMultiplier(symbolId, effectiveCount);

    if (multiplier > 0) {
      const positions = [...(symbolPositions.get(symbolId) ?? []), ...wildPositions];
      wins.push({
        symbolId,
        count: effectiveCount,
        multiplier,
        winAmount: bet * multiplier,
        positions,
      });
    }
  }

  return wins;
}

export function countScatters(reels: ReelResult): { count: number; positions: { col: number; row: number }[] } {
  const positions: { col: number; row: number }[] = [];

  for (let col = 0; col < reels.length; col++) {
    for (let row = 0; row < reels[col].length; row++) {
      if (reels[col][row] === SymbolId.SCATTER) {
        positions.push({ col, row });
      }
    }
  }

  return { count: positions.length, positions };
}
