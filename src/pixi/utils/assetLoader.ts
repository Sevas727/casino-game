import { Assets } from 'pixi.js';

const SYMBOL_COLORS: Record<string, number> = {
  wild: 0xffd700,
  scatter: 0x8b0000,
  high1: 0xff4444,
  high2: 0xff6644,
  high3: 0xff8844,
  high4: 0xffaa44,
  mid1: 0xddcc44,
  mid2: 0xbbaa44,
  low1: 0x8888cc,
  low2: 0x88aacc,
  low3: 0x88ccaa,
  low4: 0xcc8888,
  low5: 0xaaaacc,
};

export function getSymbolColor(symbolId: string): number {
  return SYMBOL_COLORS[symbolId] ?? 0xffffff;
}

export function getSymbolLabel(symbolId: string): string {
  const labels: Record<string, string> = {
    wild: 'WILD', scatter: 'SCT', high1: 'H1', high2: 'H2', high3: 'H3', high4: 'H4',
    mid1: 'MAP', mid2: 'CMP', low1: 'J', low2: 'Q', low3: 'K', low4: 'A', low5: 'O',
  };
  return labels[symbolId] ?? '?';
}

export async function loadAssets(): Promise<void> {
  // Will load real textures when available
}
