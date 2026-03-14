import { Howler } from 'howler';

type SfxName = 'spin' | 'reelStop' | 'win' | 'bigWin' | 'scatter' | 'freeSpinsIntro';

class AudioManager {
  private _enabled = true;

  get enabled(): boolean { return this._enabled; }

  init(): void {
    // For now, placeholder sounds using Web Audio API generated tones
    // Real sounds will be added later
  }

  setEnabled(enabled: boolean): void {
    this._enabled = enabled;
    Howler.mute(!enabled);
  }

  playMusic(): void {
    // Music placeholder - will be implemented with real assets
  }

  stopMusic(): void {
    // Music placeholder - will be implemented with real assets
  }

  playSfx(name: SfxName): void {
    if (!this._enabled) return;
    // Generate simple beep sounds using Web Audio as placeholders
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const frequencies: Record<SfxName, { freq: number; duration: number; type: OscillatorType }> = {
        spin: { freq: 200, duration: 0.1, type: 'sine' },
        reelStop: { freq: 400, duration: 0.05, type: 'square' },
        win: { freq: 600, duration: 0.3, type: 'sine' },
        bigWin: { freq: 800, duration: 0.5, type: 'sine' },
        scatter: { freq: 1000, duration: 0.4, type: 'triangle' },
        freeSpinsIntro: { freq: 500, duration: 0.8, type: 'sine' },
      };

      const config = frequencies[name];
      oscillator.frequency.value = config.freq;
      oscillator.type = config.type;
      gainNode.gain.value = 0.1;
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + config.duration);
    } catch {
      // Silently fail if Web Audio not available
    }
  }
}

export const audioManager = new AudioManager();
