import { useSelector, useDispatch } from 'react-redux';
import { selectTurboMode, toggleTurbo } from '../store/settingsSlice';

export function TurboButton() {
  const turbo = useSelector(selectTurboMode);
  const dispatch = useDispatch();
  return (
    <button className={`turbo-btn ${turbo ? 'active' : ''}`} onClick={() => dispatch(toggleTurbo())}>
      ⚡
    </button>
  );
}
