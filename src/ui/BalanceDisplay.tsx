import { useSelector } from 'react-redux';
import { selectBalance } from '../store/gameSlice';

function formatBalance(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function BalanceDisplay() {
  const balance = useSelector(selectBalance);

  return (
    <div className="balance-display">
      <span className="label">Balance</span>
      <span className="value">{formatBalance(balance)} FUN</span>
    </div>
  );
}
