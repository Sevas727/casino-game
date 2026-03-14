import { useSelector, useDispatch } from 'react-redux';
import { selectSoundEnabled, toggleSound } from '../store/settingsSlice';
import { audioManager } from '../audio/AudioManager';
import { useEffect } from 'react';

export function SoundToggle() {
  const enabled = useSelector(selectSoundEnabled);
  const dispatch = useDispatch();

  useEffect(() => {
    audioManager.setEnabled(enabled);
  }, [enabled]);

  return (
    <button className="sound-toggle" onClick={() => dispatch(toggleSound())} title={enabled ? 'Mute' : 'Unmute'}>
      {enabled ? '\u{1F50A}' : '\u{1F507}'}
    </button>
  );
}
