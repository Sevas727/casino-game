import { createSlice } from '@reduxjs/toolkit';

function getInitialSoundEnabled(): boolean {
  try {
    const stored = localStorage.getItem('soundEnabled');
    if (stored !== null) {
      return stored === 'true';
    }
  } catch {
    // localStorage not available (e.g. in tests)
  }
  return true;
}

export interface SettingsSliceState {
  soundEnabled: boolean;
  turboMode: boolean;
}

const initialState: SettingsSliceState = {
  soundEnabled: getInitialSoundEnabled(),
  turboMode: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled;
      try {
        localStorage.setItem('soundEnabled', String(state.soundEnabled));
      } catch {
        // localStorage not available
      }
    },

    toggleTurbo(state) {
      state.turboMode = !state.turboMode;
    },
  },
});

export const { toggleSound, toggleTurbo } = settingsSlice.actions;

export const selectSoundEnabled = (state: { settings: SettingsSliceState }) =>
  state.settings.soundEnabled;
export const selectTurboMode = (state: { settings: SettingsSliceState }) =>
  state.settings.turboMode;

export default settingsSlice.reducer;
