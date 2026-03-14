import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, ReelResult, WinResult, SpinResult, FreeSpinsState } from '../engine/types';
import { GAME_CONFIG } from '../engine/config';

export interface GameSliceState {
  gameState: GameState;
  balance: number;
  bet: number;
  reels: ReelResult;
  wins: WinResult[];
  totalWin: number;
  freeSpins: FreeSpinsState;
  autoSpinsRemaining: number;
}

const initialFreeSpins: FreeSpinsState = {
  active: false,
  remaining: 0,
  totalAwarded: 0,
  currentMultiplier: 1,
  totalWin: 0,
};

const initialState: GameSliceState = {
  gameState: 'idle',
  balance: GAME_CONFIG.startingBalance,
  bet: GAME_CONFIG.defaultBet,
  reels: [],
  wins: [],
  totalWin: 0,
  freeSpins: { ...initialFreeSpins },
  autoSpinsRemaining: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    spin(state) {
      if (state.gameState !== 'idle') return;
      state.balance -= state.bet;
      state.gameState = 'spinning';
      state.wins = [];
      state.totalWin = 0;
    },

    setResult(state, action: PayloadAction<SpinResult>) {
      const { reels, wins, totalWin, freeSpinsAwarded } = action.payload;
      state.reels = reels;
      state.wins = wins;
      state.totalWin = totalWin;

      if (freeSpinsAwarded > 0) {
        if (state.freeSpins.active) {
          state.freeSpins.remaining += freeSpinsAwarded;
          state.freeSpins.totalAwarded += freeSpinsAwarded;
        } else {
          state.freeSpins = {
            active: true,
            remaining: freeSpinsAwarded,
            totalAwarded: freeSpinsAwarded,
            currentMultiplier: 1,
            totalWin: 0,
          };
        }
        state.gameState = 'free-spins-intro';
      } else if (totalWin > 0) {
        state.balance += totalWin;
        state.gameState = 'showing-win';
      } else {
        state.gameState = 'idle';
      }
    },

    winAnimationComplete(state) {
      if (state.freeSpins.active) {
        state.freeSpins.totalWin += state.totalWin;
      }
      state.gameState = 'idle';
    },

    freeSpinTick(state) {
      if (state.freeSpins.remaining > 0) {
        state.freeSpins.remaining -= 1;
      }
      if (state.freeSpins.remaining === 0) {
        state.freeSpins.active = false;
      }
    },

    setBet(state, action: PayloadAction<number>) {
      if (state.gameState !== 'idle') return;
      state.bet = action.payload;
    },

    increaseBet(state) {
      if (state.gameState !== 'idle') return;
      const { betOptions } = GAME_CONFIG;
      const currentIndex = betOptions.indexOf(state.bet);
      if (currentIndex < betOptions.length - 1) {
        state.bet = betOptions[currentIndex + 1];
      }
    },

    decreaseBet(state) {
      if (state.gameState !== 'idle') return;
      const { betOptions } = GAME_CONFIG;
      const currentIndex = betOptions.indexOf(state.bet);
      if (currentIndex > 0) {
        state.bet = betOptions[currentIndex - 1];
      }
    },

    setAutoSpins(state, action: PayloadAction<number>) {
      state.autoSpinsRemaining = action.payload;
    },

    decrementAutoSpins(state) {
      if (state.autoSpinsRemaining > 0) {
        state.autoSpinsRemaining -= 1;
      }
    },

    cancelAutoSpins(state) {
      state.autoSpinsRemaining = 0;
    },
  },
});

export const {
  spin,
  setResult,
  winAnimationComplete,
  freeSpinTick,
  setBet,
  increaseBet,
  decreaseBet,
  setAutoSpins,
  decrementAutoSpins,
  cancelAutoSpins,
} = gameSlice.actions;

// Selectors
export const selectBalance = (state: { game: GameSliceState }) => state.game.balance;
export const selectBet = (state: { game: GameSliceState }) => state.game.bet;
export const selectGameState = (state: { game: GameSliceState }) => state.game.gameState;
export const selectReels = (state: { game: GameSliceState }) => state.game.reels;
export const selectWins = (state: { game: GameSliceState }) => state.game.wins;
export const selectTotalWin = (state: { game: GameSliceState }) => state.game.totalWin;
export const selectFreeSpins = (state: { game: GameSliceState }) => state.game.freeSpins;
export const selectAutoSpins = (state: { game: GameSliceState }) => state.game.autoSpinsRemaining;

export default gameSlice.reducer;
