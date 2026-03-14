import { describe, it, expect } from 'vitest';
import gameReducer, {
  type GameSliceState,
  spin,
  setResult,
  setBet,
  increaseBet,
  decreaseBet,
} from '../gameSlice';
import type { SpinResult } from '../../engine/types';
import { SymbolId } from '../../engine/types';

function getInitialState(): GameSliceState {
  return gameReducer(undefined, { type: '@@INIT' });
}

describe('gameSlice', () => {
  it('has correct initial state', () => {
    const state = getInitialState();
    expect(state.balance).toBe(10000);
    expect(state.bet).toBe(2);
    expect(state.gameState).toBe('idle');
    expect(state.reels).toEqual([]);
    expect(state.wins).toEqual([]);
    expect(state.totalWin).toBe(0);
    expect(state.autoSpinsRemaining).toBe(0);
    expect(state.freeSpins.active).toBe(false);
  });

  it('spin() deducts bet and sets gameState to spinning', () => {
    const state = gameReducer(getInitialState(), spin());
    expect(state.balance).toBe(9998);
    expect(state.gameState).toBe('spinning');
    expect(state.wins).toEqual([]);
    expect(state.totalWin).toBe(0);
  });

  it('spin() does nothing if not idle', () => {
    let state = gameReducer(getInitialState(), spin());
    // Now gameState is 'spinning', spin again should do nothing
    const stateAfter = gameReducer(state, spin());
    expect(stateAfter.balance).toBe(9998);
    expect(stateAfter.gameState).toBe('spinning');
  });

  it('setResult with no wins sets gameState back to idle', () => {
    let state = gameReducer(getInitialState(), spin());
    const result: SpinResult = {
      reels: [[SymbolId.LOW1, SymbolId.LOW2]],
      wins: [],
      totalWin: 0,
      scatterCount: 0,
      freeSpinsAwarded: 0,
    };
    state = gameReducer(state, setResult(result));
    expect(state.gameState).toBe('idle');
    expect(state.totalWin).toBe(0);
    expect(state.reels).toEqual([[SymbolId.LOW1, SymbolId.LOW2]]);
  });

  it('setResult with wins adds to balance and sets showing-win', () => {
    let state = gameReducer(getInitialState(), spin());
    const result: SpinResult = {
      reels: [[SymbolId.HIGH1, SymbolId.HIGH1]],
      wins: [
        {
          symbolId: SymbolId.HIGH1,
          count: 8,
          multiplier: 2,
          winAmount: 50,
          positions: [
            { col: 0, row: 0 },
            { col: 0, row: 1 },
          ],
        },
      ],
      totalWin: 50,
      scatterCount: 0,
      freeSpinsAwarded: 0,
    };
    state = gameReducer(state, setResult(result));
    expect(state.gameState).toBe('showing-win');
    expect(state.totalWin).toBe(50);
    // balance was 9998 after spin, +50 win = 10048
    expect(state.balance).toBe(10048);
  });

  it('setResult with freeSpinsAwarded sets free-spins-intro', () => {
    let state = gameReducer(getInitialState(), spin());
    const result: SpinResult = {
      reels: [[SymbolId.SCATTER, SymbolId.SCATTER, SymbolId.SCATTER]],
      wins: [],
      totalWin: 0,
      scatterCount: 3,
      freeSpinsAwarded: 10,
    };
    state = gameReducer(state, setResult(result));
    expect(state.gameState).toBe('free-spins-intro');
    expect(state.freeSpins.active).toBe(true);
    expect(state.freeSpins.remaining).toBe(10);
    expect(state.freeSpins.totalAwarded).toBe(10);
  });

  it('setBet changes bet when idle', () => {
    const state = gameReducer(getInitialState(), setBet(50));
    expect(state.bet).toBe(50);
  });

  it('setBet does nothing when not idle', () => {
    let state = gameReducer(getInitialState(), spin());
    state = gameReducer(state, setBet(50));
    expect(state.bet).toBe(2);
  });

  it('increaseBet steps through bet options', () => {
    // default bet is 2, options are [1, 2, 5, 20, 50, 100]
    let state = getInitialState();
    state = gameReducer(state, increaseBet());
    expect(state.bet).toBe(5);
    state = gameReducer(state, increaseBet());
    expect(state.bet).toBe(20);
  });

  it('decreaseBet steps through bet options', () => {
    let state = getInitialState();
    state = gameReducer(state, decreaseBet());
    expect(state.bet).toBe(1);
  });

  it('increaseBet does not go beyond max', () => {
    let state = gameReducer(getInitialState(), setBet(100));
    state = gameReducer(state, increaseBet());
    expect(state.bet).toBe(100);
  });

  it('decreaseBet does not go below min', () => {
    let state = gameReducer(getInitialState(), setBet(1));
    state = gameReducer(state, decreaseBet());
    expect(state.bet).toBe(1);
  });
});
