import { useSelector, useDispatch } from 'react-redux';
import { selectGameState, spin } from '../store/gameSlice';

export function SpinButton() {
  const gameState = useSelector(selectGameState);
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
    <button
      className={`spin-btn${isSpinning ? ' spinning' : ''}`}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
}
