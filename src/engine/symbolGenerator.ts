import { GAME_CONFIG } from './config';
import { pickWeighted } from './rng';
import { type ReelResult, SymbolId } from './types';

export function generateReelResult(): ReelResult {
  const weightedSymbols = GAME_CONFIG.symbols.map(s => ({
    value: s.id,
    weight: s.weight,
  }));

  const result: ReelResult = [];
  for (let col = 0; col < GAME_CONFIG.cols; col++) {
    const column: SymbolId[] = [];
    for (let row = 0; row < GAME_CONFIG.rows; row++) {
      column.push(pickWeighted(weightedSymbols));
    }
    result.push(column);
  }
  return result;
}
