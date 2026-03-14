import { GameConfig, SymbolConfig, SymbolId } from './types';

const symbols: SymbolConfig[] = [
  {
    id: SymbolId.WILD,
    name: 'Wild',
    pays: [],
    weight: 2,
  },
  {
    id: SymbolId.SCATTER,
    name: 'Scatter',
    pays: [],
    weight: 3,
  },
  {
    id: SymbolId.HIGH1,
    name: 'High 1',
    pays: [
      { minCount: 8, maxCount: 12, multiplier: 2 },
      { minCount: 13, maxCount: 14, multiplier: 100 },
      { minCount: 15, maxCount: 24, multiplier: 750 },
      { minCount: 25, maxCount: 30, multiplier: 1500 },
    ],
    weight: 5,
  },
  {
    id: SymbolId.HIGH2,
    name: 'High 2',
    pays: [
      { minCount: 8, maxCount: 12, multiplier: 1.5 },
      { minCount: 13, maxCount: 14, multiplier: 75 },
      { minCount: 15, maxCount: 24, multiplier: 500 },
      { minCount: 25, maxCount: 30, multiplier: 1000 },
    ],
    weight: 6,
  },
  {
    id: SymbolId.HIGH3,
    name: 'High 3',
    pays: [
      { minCount: 8, maxCount: 12, multiplier: 1.25 },
      { minCount: 13, maxCount: 14, multiplier: 50 },
      { minCount: 15, maxCount: 24, multiplier: 250 },
      { minCount: 25, maxCount: 30, multiplier: 750 },
    ],
    weight: 7,
  },
  {
    id: SymbolId.HIGH4,
    name: 'High 4',
    pays: [
      { minCount: 8, maxCount: 12, multiplier: 1 },
      { minCount: 13, maxCount: 14, multiplier: 40 },
      { minCount: 15, maxCount: 24, multiplier: 200 },
      { minCount: 25, maxCount: 30, multiplier: 500 },
    ],
    weight: 8,
  },
  {
    id: SymbolId.MID1,
    name: 'Mid 1',
    pays: [
      { minCount: 8, maxCount: 12, multiplier: 0.75 },
      { minCount: 13, maxCount: 14, multiplier: 25 },
      { minCount: 15, maxCount: 24, multiplier: 100 },
      { minCount: 25, maxCount: 30, multiplier: 250 },
    ],
    weight: 10,
  },
  {
    id: SymbolId.MID2,
    name: 'Mid 2',
    pays: [
      { minCount: 8, maxCount: 12, multiplier: 0.5 },
      { minCount: 13, maxCount: 14, multiplier: 20 },
      { minCount: 15, maxCount: 24, multiplier: 75 },
      { minCount: 25, maxCount: 30, multiplier: 200 },
    ],
    weight: 10,
  },
  {
    id: SymbolId.LOW1,
    name: 'Low 1',
    pays: [
      { minCount: 8, maxCount: 12, multiplier: 2 },
      { minCount: 13, maxCount: 14, multiplier: 15 },
      { minCount: 15, maxCount: 24, multiplier: 50 },
      { minCount: 25, maxCount: 30, multiplier: 150 },
    ],
    weight: 15,
  },
  {
    id: SymbolId.LOW2,
    name: 'Low 2',
    pays: [
      { minCount: 8, maxCount: 12, multiplier: 1.5 },
      { minCount: 13, maxCount: 14, multiplier: 12.5 },
      { minCount: 15, maxCount: 24, multiplier: 40 },
      { minCount: 25, maxCount: 30, multiplier: 125 },
    ],
    weight: 15,
  },
  {
    id: SymbolId.LOW3,
    name: 'Low 3',
    pays: [
      { minCount: 8, maxCount: 12, multiplier: 1.25 },
      { minCount: 13, maxCount: 14, multiplier: 10 },
      { minCount: 15, maxCount: 24, multiplier: 30 },
      { minCount: 25, maxCount: 30, multiplier: 100 },
    ],
    weight: 15,
  },
  {
    id: SymbolId.LOW4,
    name: 'Low 4',
    pays: [
      { minCount: 8, maxCount: 12, multiplier: 1 },
      { minCount: 13, maxCount: 14, multiplier: 7.5 },
      { minCount: 15, maxCount: 24, multiplier: 25 },
      { minCount: 25, maxCount: 30, multiplier: 75 },
    ],
    weight: 15,
  },
  {
    id: SymbolId.LOW5,
    name: 'Low 5',
    pays: [
      { minCount: 8, maxCount: 12, multiplier: 0.75 },
      { minCount: 13, maxCount: 14, multiplier: 5 },
      { minCount: 15, maxCount: 24, multiplier: 20 },
      { minCount: 25, maxCount: 30, multiplier: 50 },
    ],
    weight: 15,
  },
];

export const GAME_CONFIG: GameConfig = {
  rows: 5,
  cols: 6,
  symbols,
  betOptions: [1, 2, 5, 20, 50, 100],
  defaultBet: 2,
  startingBalance: 10000,
  freeSpinsTrigger: [
    { count: 3, spins: 10 },
    { count: 4, spins: 25 },
    { count: 5, spins: 50 },
  ],
  freeSpinsMultipliers: [2, 3],
};

export function getSymbolConfig(id: SymbolId): SymbolConfig {
  const config = GAME_CONFIG.symbols.find((s) => s.id === id);
  if (!config) {
    throw new Error(`Unknown symbol id: ${id}`);
  }
  return config;
}

export function getPayMultiplier(symbolId: SymbolId, count: number): number {
  const config = getSymbolConfig(symbolId);
  for (const pay of config.pays) {
    if (count >= pay.minCount && count <= pay.maxCount) {
      return pay.multiplier;
    }
  }
  return 0;
}
