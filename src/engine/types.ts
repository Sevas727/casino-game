export enum SymbolId {
  WILD = 'wild',
  SCATTER = 'scatter',
  HIGH1 = 'high1',
  HIGH2 = 'high2',
  HIGH3 = 'high3',
  HIGH4 = 'high4',
  MID1 = 'mid1',
  MID2 = 'mid2',
  LOW1 = 'low1',
  LOW2 = 'low2',
  LOW3 = 'low3',
  LOW4 = 'low4',
  LOW5 = 'low5',
}

export interface SymbolPayEntry {
  minCount: number;
  maxCount: number;
  multiplier: number;
}

export interface SymbolConfig {
  id: SymbolId;
  name: string;
  pays: SymbolPayEntry[];
  weight: number;
}

export interface GameConfig {
  rows: number;
  cols: number;
  symbols: SymbolConfig[];
  betOptions: number[];
  defaultBet: number;
  startingBalance: number;
  freeSpinsTrigger: { count: number; spins: number }[];
  freeSpinsMultipliers: number[];
}

export type ReelResult = SymbolId[][];

export interface WinResult {
  symbolId: SymbolId;
  count: number;
  multiplier: number;
  winAmount: number;
  positions: { col: number; row: number }[];
}

export interface SpinResult {
  reels: ReelResult;
  wins: WinResult[];
  totalWin: number;
  scatterCount: number;
  freeSpinsAwarded: number;
}

export type GameState = 'idle' | 'spinning' | 'stopping' | 'showing-win' | 'free-spins-intro';

export interface FreeSpinsState {
  active: boolean;
  remaining: number;
  totalAwarded: number;
  currentMultiplier: number;
  totalWin: number;
}
