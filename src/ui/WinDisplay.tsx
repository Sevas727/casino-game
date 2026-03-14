import { useSelector } from 'react-redux';
import { selectTotalWin } from '../store/gameSlice';

function formatValue(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function WinDisplay() {
  const totalWin = useSelector(selectTotalWin);

  if (totalWin <= 0) return null;

  return (
    <div className="win-display">
      <span className="label">Win</span>
      <span className="value">{formatValue(totalWin)} FUN</span>
    </div>
  );
}
