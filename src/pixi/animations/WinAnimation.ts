import { Container, Graphics, Text } from 'pixi.js';
import type { ReelsContainer } from '../components/ReelsContainer';
import type { WinResult } from '../../engine/types';
import { SymbolView } from '../components/SymbolView';

/** Track active animation frame IDs so we can cancel them on cleanup. */
const activeAnimationFrames: number[] = [];

/**
 * Create a multi-layered golden lightning/electric glow border around a symbol.
 * Returns a Container with animated pulsing layers.
 */
function createLightningGlow(
  x: number,
  y: number,
  w: number,
  h: number,
): Container {
  const glowContainer = new Container();
  glowContainer.label = 'winGlow';

  // Layer 1: Wide outer soft glow (orange-gold, very transparent)
  const outerGlow = new Graphics();
  outerGlow.roundRect(x - 6, y - 6, w + 12, h + 12, 18);
  outerGlow.stroke({ color: 0xffa500, width: 10, alpha: 0.25 });
  glowContainer.addChild(outerGlow);

  // Layer 2: Secondary outer glow (brighter gold)
  const outerGlow2 = new Graphics();
  outerGlow2.roundRect(x - 3, y - 3, w + 6, h + 6, 16);
  outerGlow2.stroke({ color: 0xffb800, width: 6, alpha: 0.4 });
  glowContainer.addChild(outerGlow2);

  // Layer 3: Main golden border (thick, bright)
  const mainBorder = new Graphics();
  mainBorder.roundRect(x, y, w, h, 14);
  mainBorder.stroke({ color: 0xffd700, width: 5, alpha: 0.95 });
  glowContainer.addChild(mainBorder);

  // Layer 4: Inner bright white-gold highlight
  const innerGlow = new Graphics();
  innerGlow.roundRect(x + 3, y + 3, w - 6, h - 6, 12);
  innerGlow.stroke({ color: 0xffec80, width: 2.5, alpha: 0.8 });
  glowContainer.addChild(innerGlow);

  // Layer 5: Innermost white-hot core highlight
  const coreGlow = new Graphics();
  coreGlow.roundRect(x + 5, y + 5, w - 10, h - 10, 10);
  coreGlow.stroke({ color: 0xfff8dc, width: 1.5, alpha: 0.5 });
  glowContainer.addChild(coreGlow);

  // Animate with pulsing/flickering lightning effect
  let time = 0;
  const animate = () => {
    time += 0.06;

    // Primary pulse wave
    const pulse = 0.6 + 0.4 * Math.sin(time * 3);
    // Secondary faster flicker for lightning feel
    const flicker = 0.85 + 0.15 * Math.sin(time * 11 + Math.random() * 0.3);
    // Tertiary crackle - occasional bright flash
    const crackle = Math.random() > 0.92 ? 1.3 : 1.0;

    outerGlow.alpha = pulse * 0.35 * flicker * crackle;
    outerGlow2.alpha = pulse * 0.5 * flicker * crackle;
    mainBorder.alpha = (0.8 + 0.2 * Math.sin(time * 4)) * flicker * crackle;
    innerGlow.alpha = pulse * 0.9 * crackle;
    coreGlow.alpha = (0.4 + 0.4 * Math.sin(time * 6)) * flicker * crackle;

    if (glowContainer.parent) {
      const frameId = requestAnimationFrame(animate);
      activeAnimationFrames.push(frameId);
    }
  };
  const frameId = requestAnimationFrame(animate);
  activeAnimationFrames.push(frameId);

  return glowContainer;
}

/**
 * Show win highlights: dim non-winning symbols, add dramatic golden lightning
 * glow around winners. For big wins, show pulsing text overlay.
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

  // Highlight symbols on the reels (dims non-winners to alpha 0.3)
  reelsContainer.highlightWinSymbols(positions);

  // Add lightning glow borders in the winLayer
  const posSet = new Set(positions.map((p) => `${p.col},${p.row}`));

  for (const pos of positions) {
    const key = `${pos.col},${pos.row}`;
    if (!posSet.has(key)) continue;
    posSet.delete(key);

    const x = reelsContainer.x + pos.col * SymbolView.WIDTH;
    const y = reelsContainer.y + pos.row * SymbolView.HEIGHT;

    const glow = createLightningGlow(
      x + 1,
      y + 1,
      SymbolView.WIDTH - 2,
      SymbolView.HEIGHT - 2,
    );
    winLayer.addChild(glow);
  }

  // Big win pulsing text (threshold: win >= 10x bet)
  const isBigWin = totalWin >= bet * 10;
  if (isBigWin) {
    const bigWinText = new Text({
      text: `BIG WIN!\n${totalWin}`,
      style: {
        fontSize: 96,
        fill: 0xffd700,
        fontWeight: 'bold',
        align: 'center',
        stroke: { color: 0x000000, width: 6 },
        dropShadow: {
          color: 0xffa500,
          blur: 16,
          distance: 0,
          angle: 0,
        },
      },
    });
    bigWinText.anchor.set(0.5);
    bigWinText.x = 1920 / 2;
    bigWinText.y = 1080 / 2;
    bigWinText.label = 'bigWinText';
    winLayer.addChild(bigWinText);

    // Dramatic pulsing with glow effect
    let pulseTime = 0;
    const pulseUpdate = () => {
      pulseTime += 16;
      const t = (pulseTime / 300) * Math.PI;
      const scale = 1 + 0.15 * Math.sin(t);
      bigWinText.scale.set(scale);
      // Flicker alpha for dramatic effect
      bigWinText.alpha = 0.85 + 0.15 * Math.sin(t * 2.5);
      if (bigWinText.parent) {
        const frameId = requestAnimationFrame(pulseUpdate);
        activeAnimationFrames.push(frameId);
      }
    };
    const frameId = requestAnimationFrame(pulseUpdate);
    activeAnimationFrames.push(frameId);
  }
}

/**
 * Clear all win highlights: restore symbol alpha, cancel animations,
 * and remove winLayer children.
 */
export function clearWin(
  reelsContainer: ReelsContainer,
  winLayer: Container,
): void {
  // Cancel all active animation frames
  for (const frameId of activeAnimationFrames) {
    cancelAnimationFrame(frameId);
  }
  activeAnimationFrames.length = 0;

  reelsContainer.clearHighlights();
  winLayer.removeChildren();
}
