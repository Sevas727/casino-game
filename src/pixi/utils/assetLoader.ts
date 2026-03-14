import { Assets, type Texture } from 'pixi.js';

const SYMBOL_TEXTURES: Record<string, string> = {
  wild: '/assets/images/symbols/wild.png',
  scatter: '/assets/images/symbols/scatter.png',
  high1: '/assets/images/symbols/high1.png',
  high2: '/assets/images/symbols/high2.png',
  high3: '/assets/images/symbols/high3.png',
  high4: '/assets/images/symbols/high4.png',
  mid1: '/assets/images/symbols/mid1.png',
  mid2: '/assets/images/symbols/mid2.png',
  low1: '/assets/images/symbols/low1.png',
  low2: '/assets/images/symbols/low2.png',
  low3: '/assets/images/symbols/low3.png',
  low4: '/assets/images/symbols/low4.png',
  low5: '/assets/images/symbols/low5.png',
};

export async function loadAssets(): Promise<void> {
  const bundles = [
    { alias: 'background', src: '/assets/images/background.png' },
    { alias: 'frame', src: '/assets/images/frame.png' },
    { alias: 'logo', src: '/assets/images/ui/logo.png' },
    ...Object.entries(SYMBOL_TEXTURES).map(([alias, src]) => ({ alias: `symbol_${alias}`, src })),
  ];

  await Assets.load(bundles);
}

export function getSymbolTexture(symbolId: string): Texture | null {
  const texture = Assets.get(`symbol_${symbolId}`);
  return texture ?? null;
}

export function getTexture(alias: string): Texture | null {
  return Assets.get(alias) ?? null;
}

// Keep color fallbacks for when textures haven't loaded
const SYMBOL_COLORS: Record<string, number> = {
  wild: 0xffd700, scatter: 0x8b0000,
  high1: 0xff4444, high2: 0xff6644, high3: 0xff8844, high4: 0xffaa44,
  mid1: 0xddcc44, mid2: 0xbbaa44,
  low1: 0x8888cc, low2: 0x88aacc, low3: 0x88ccaa, low4: 0xcc8888, low5: 0xaaaacc,
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
