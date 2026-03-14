import { BalanceDisplay } from './BalanceDisplay';
import { WinDisplay } from './WinDisplay';
import { BetControls } from './BetControls';
import { SpinButton } from './SpinButton';
import { TurboButton } from './TurboButton';
import { AutoSpinButton } from './AutoSpinButton';

export function BottomBar() {
  return (
    <div className="bottom-bar">
      <BalanceDisplay />
      <WinDisplay />
      <TurboButton />
      <BetControls />
      <SpinButton />
      <AutoSpinButton />
    </div>
  );
}
