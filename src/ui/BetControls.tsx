import { useSelector, useDispatch } from 'react-redux';
import { selectBet, selectGameState, increaseBet, decreaseBet } from '../store/gameSlice';

export function BetControls() {
  const bet = useSelector(selectBet);
  const gameState = useSelector(selectGameState);
  const dispatch = useDispatch();
  const disabled = gameState !== 'idle';

  return (
    <div className="bet-controls">
      <span className="label">Bet</span>
      <button
        className="bet-btn"
        onClick={() => dispatch(decreaseBet())}
        disabled={disabled}
      >
        −
      </button>
      <span className="bet-value">{bet}</span>
      <button
        className="bet-btn"
        onClick={() => dispatch(increaseBet())}
        disabled={disabled}
      >
        +
      </button>
    </div>
  );
}
