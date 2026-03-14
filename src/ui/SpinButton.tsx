import { useSelector, useDispatch } from 'react-redux';
import { selectGameState, selectAutoSpins, spin } from '../store/gameSlice';

export function SpinButton() {
  const gameState = useSelector(selectGameState);
  const autoSpins = useSelector(selectAutoSpins);
  const dispatch = useDispatch();

  const isSpinning = gameState === 'spinning';
  const isDisabled = gameState === 'showing-win' || gameState === 'free-spins-intro';

  const handleClick = () => {
    if (gameState === 'idle') {
      dispatch(spin());
    }
  };

  let label = 'SPIN';
  if (isSpinning) label = 'STOP';

  return (
    <div className="spin-btn-wrapper">
      <button
        className={`spin-btn${isSpinning ? ' spinning' : ''}`}
        onClick={handleClick}
        disabled={isDisabled}
      >
        {label}
      </button>
      {autoSpins > 0 && (
        <span className="auto-spin-count">{autoSpins}</span>
      )}
    </div>
  );
}
