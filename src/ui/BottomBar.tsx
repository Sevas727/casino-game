import { BalanceDisplay } from './BalanceDisplay';
import { WinDisplay } from './WinDisplay';
import { BetControls } from './BetControls';
import { SpinButton } from './SpinButton';
import { TurboButton } from './TurboButton';
import { AutoSpinButton } from './AutoSpinButton';

export function BottomBar() {
  return (
    <div className="bottom-bar">
      <div className="bar-left">
        <BalanceDisplay />
        <WinDisplay />
      </div>
      <div className="bar-center">
        <TurboButton />
        <SpinButton />
        <AutoSpinButton />
      </div>
      <div className="bar-right">
        <BetControls />
      </div>
    </div>
  );
}
