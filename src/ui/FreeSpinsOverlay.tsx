import { useSelector } from 'react-redux';
import { selectFreeSpins } from '../store/gameSlice';

export function FreeSpinsOverlay() {
  const freeSpins = useSelector(selectFreeSpins);
  if (!freeSpins.active) return null;

  return (
    <div className="free-spins-overlay">
      <div className="free-spins-header">FREE SPINS</div>
      <div className="free-spins-remaining">{freeSpins.remaining} left</div>
      {freeSpins.currentMultiplier > 1 && (
        <div className="free-spins-multiplier">x{freeSpins.currentMultiplier}</div>
      )}
      {freeSpins.totalWin > 0 && (
        <div className="free-spins-total-win">Total Win: {freeSpins.totalWin} FUN</div>
      )}
    </div>
  );
}
