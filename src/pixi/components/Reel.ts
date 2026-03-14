import { Container } from 'pixi.js';
import { SymbolView } from './SymbolView';
import type { SymbolId } from '../../engine/types';
import { GAME_CONFIG } from '../../engine/config';

export class Reel extends Container {
  public symbols: SymbolView[] = [];

  constructor(private colIndex: number) {
    super();
    for (let row = 0; row < GAME_CONFIG.rows; row++) {
      const sym = new SymbolView('low1' as SymbolId);
      sym.y = row * SymbolView.HEIGHT;
      this.symbols.push(sym);
      this.addChild(sym);
    }
  }

  setSymbols(symbolIds: SymbolId[]): void {
    symbolIds.forEach((id, row) => {
      if (this.symbols[row]) this.symbols[row].setSymbol(id);
    });
  }
}
