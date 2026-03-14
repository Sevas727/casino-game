import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAutoSpins, setAutoSpins, cancelAutoSpins, selectGameState } from '../store/gameSlice';

export function AutoSpinButton() {
  const [showOptions, setShowOptions] = useState(false);
  const autoSpins = useSelector(selectAutoSpins);
  const gameState = useSelector(selectGameState);
  const dispatch = useDispatch();

  if (autoSpins > 0) {
    return (
      <button className="auto-spin-btn active" onClick={() => dispatch(cancelAutoSpins())}>
        <span className="auto-count">{autoSpins}</span>
      </button>
    );
  }

  return (
    <div className="auto-spin-wrapper">
      <button className="auto-spin-btn" onClick={() => setShowOptions(!showOptions)} disabled={gameState !== 'idle'}>
        AUTO
      </button>
      {showOptions && (
        <div className="auto-spin-options">
          {[5, 20, 50, 100].map(n => (
            <button key={n} onClick={() => { dispatch(setAutoSpins(n)); setShowOptions(false); }}>
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
