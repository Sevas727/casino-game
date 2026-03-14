import type { SymbolId } from '../../engine/types';
import { GAME_CONFIG } from '../../engine/config';

/** Simple ease-out-back for bounce effect on stop */
export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export interface SpinConfig {
  /** Total spin duration per reel in ms (before stop signal) */
  duration: number;
  /** Delay between each reel stopping in ms */
  delayBetweenReels: number;
  /** Pixels moved per frame at 60fps baseline */
  speed: number;
  /** Bounce overshoot in pixels */
  bounce: number;
}

export const NORMAL_SPIN: SpinConfig = {
  duration: 1000,
  delayBetweenReels: 200,
  speed: 40,
  bounce: 20,
};

export const TURBO_SPIN: SpinConfig = {
  duration: 400,
  delayBetweenReels: 80,
  speed: 60,
  bounce: 15,
};

/** Pick a random symbol from GAME_CONFIG.symbols weighted list */
export function getRandomSymbol(): SymbolId {
  const symbols = GAME_CONFIG.symbols;
  const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);
  let r = Math.random() * totalWeight;
  for (const s of symbols) {
    r -= s.weight;
    if (r <= 0) return s.id;
  }
  return symbols[symbols.length - 1].id;
}

/** Number of buffer symbols above the visible area */
export const BUFFER_SYMBOLS = 2;

export function getSpinConfig(turbo: boolean): SpinConfig {
  return turbo ? TURBO_SPIN : NORMAL_SPIN;
}
