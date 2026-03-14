import { Container, Graphics, Text } from 'pixi.js';
import type { ReelsContainer } from '../components/ReelsContainer';
import type { WinResult } from '../../engine/types';
import { SymbolView } from '../components/SymbolView';
import { BUFFER_SYMBOLS } from './ReelSpinAnimation';

/**
 * Show win highlights: dim non-winning symbols, add golden glow around winners.
 * For big wins (totalWin >= 50 * bet or externally flagged), show pulsing text.
 */
export function showWin(
  reelsContainer: ReelsContainer,
  wins: WinResult[],
  winLayer: Container,
  totalWin: number,
  bet: number,
): void {
  // Collect all winning positions
  const positions: { col: number; row: number }[] = [];
  for (const win of wins) {
    for (const pos of win.positions) {
      positions.push(pos);
    }
  }

  // Highlight symbols on the reels
  reelsContainer.highlightWinSymbols(positions);

  // Add golden glow borders in the winLayer (positioned to match reelsContainer)
  const posSet = new Set(positions.map((p) => `${p.col},${p.row}`));

  for (const pos of positions) {
    // Avoid duplicate glows for the same cell
    const key = `${pos.col},${pos.row}`;
    if (!posSet.has(key)) continue;
    posSet.delete(key);

    const glow = new Graphics();
    const x = reelsContainer.x + pos.col * SymbolView.WIDTH;
    const y = reelsContainer.y + pos.row * SymbolView.HEIGHT;

    // Outer golden glow
    glow.roundRect(x + 1, y + 1, SymbolView.WIDTH - 2, SymbolView.HEIGHT - 2, 14);
    glow.stroke({ color: 0xffd700, width: 4, alpha: 0.9 });

    // Inner brighter border
    glow.roundRect(x + 4, y + 4, SymbolView.WIDTH - 8, SymbolView.HEIGHT - 8, 12);
    glow.stroke({ color: 0xffec80, width: 2, alpha: 0.7 });

    winLayer.addChild(glow);
  }

  // Big win pulsing text (threshold: win >= 10x bet)
  const isBigWin = totalWin >= bet * 10;
  if (isBigWin) {
    const bigWinText = new Text({
      text: `BIG WIN!\n${totalWin}`,
      style: {
        fontSize: 72,
        fill: 0xffd700,
        fontWeight: 'bold',
        align: 'center',
        stroke: { color: 0x000000, width: 4 },
        dropShadow: {
          color: 0x000000,
          blur: 8,
          distance: 4,
          angle: Math.PI / 4,
        },
      },
    });
    bigWinText.anchor.set(0.5);
    bigWinText.x = 1920 / 2;
    bigWinText.y = 1080 / 2;
    bigWinText.label = 'bigWinText';
    winLayer.addChild(bigWinText);

    // Simple pulsing via scale animation frame loop
    let pulseTime = 0;
    const pulseUpdate = () => {
      pulseTime += 16; // approximate frame time
      const scale = 1 + 0.1 * Math.sin((pulseTime / 300) * Math.PI);
      bigWinText.scale.set(scale);
      if (bigWinText.parent) {
        requestAnimationFrame(pulseUpdate);
      }
    };
    requestAnimationFrame(pulseUpdate);
  }
}

/**
 * Clear all win highlights: restore symbol alpha and remove winLayer children.
 */
export function clearWin(
  reelsContainer: ReelsContainer,
  winLayer: Container,
): void {
  reelsContainer.clearHighlights();
  winLayer.removeChildren();
}
