import { BalanceDisplay } from './BalanceDisplay';
import { WinDisplay } from './WinDisplay';
import { BetControls } from './BetControls';
import { SpinButton } from './SpinButton';

export function BottomBar() {
  return (
    <div className="bottom-bar">
      <BalanceDisplay />
      <WinDisplay />
      <BetControls />
      <SpinButton />
    </div>
  );
}
