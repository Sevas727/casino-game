import { GAME_CONFIG } from '../engine/config';
import { SymbolId } from '../engine/types';

interface Props { onClose: () => void; }

export function RulesModal({ onClose }: Props) {
  const regularSymbols = GAME_CONFIG.symbols.filter(s => s.id !== SymbolId.WILD && s.id !== SymbolId.SCATTER);

  return (
    <div className="rules-overlay" onClick={onClose}>
      <div className="rules-content" onClick={e => e.stopPropagation()}>
        <button className="rules-close" onClick={onClose}>{'\u2715'}</button>

        <h2>SYMBOLS</h2>
        <div className="symbols-grid">
          {/* Special symbols */}
          <div className="symbol-info">
            <img src="/assets/images/symbols/scatter.png" alt="Scatter" className="symbol-preview-img" />
            <div className="symbol-pays">
              <div className="symbol-name">Free Spins</div>
              <div>5-25 &rarr; 50 fs</div>
              <div>4 &rarr; 25 fs</div>
              <div>3 &rarr; 10 fs</div>
            </div>
          </div>
          <div className="symbol-info">
            <img src="/assets/images/symbols/wild.png" alt="Wild" className="symbol-preview-img" />
            <div className="symbol-pays">
              <div className="symbol-name">Wild</div>
              <div>Replaces any symbol except scatter</div>
            </div>
          </div>

          {/* Regular symbols with paytable */}
          {regularSymbols.map(sym => (
            <div key={sym.id} className="symbol-info">
              <img src={`/assets/images/symbols/${sym.id}.png`} alt={sym.name} className="symbol-preview-img" />
              <div className="symbol-pays">
                <div className="symbol-name">{sym.name}</div>
                {sym.pays.map((pay, i) => (
                  <div key={i}>{pay.minCount === pay.maxCount ? pay.minCount : `${pay.minCount}-${pay.maxCount}`} &rarr; {pay.multiplier}x</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2>RULES</h2>
        <p>Scatter Pays: wins are calculated by counting identical symbols anywhere on the 6x5 grid. 7 or more matching symbols trigger a win.</p>
        <p>Wild symbols count toward every regular symbol type.</p>

        <h2>FREE SPINS</h2>
        <p>3 or more Scatter symbols trigger Free Spins. During free spins, each win is multiplied by a random multiplier (x2 or x3). Free spins can be re-triggered.</p>
      </div>
    </div>
  );
}
