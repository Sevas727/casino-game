import { Howler } from 'howler';

type SfxName = 'spin' | 'reelStop' | 'win' | 'bigWin' | 'scatter' | 'freeSpinsIntro';

class AudioManager {
  private _enabled = true;
  private _ctx: AudioContext | null = null;
  private _musicNodes: (AudioBufferSourceNode | OscillatorNode | GainNode)[] = [];
  private _musicInterval: ReturnType<typeof setInterval> | null = null;
  private _musicPlaying = false;
  private _spinLoopNodes: (AudioBufferSourceNode | OscillatorNode | GainNode | BiquadFilterNode)[] = [];
  private _spinLoopPlaying = false;

  get enabled(): boolean { return this._enabled; }

  private getContext(): AudioContext | null {
    try {
      if (!this._ctx || this._ctx.state === 'closed') {
        this._ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this._ctx.state === 'suspended') {
        this._ctx.resume();
      }
      return this._ctx;
    } catch {
      return null;
    }
  }

  init(): void {
    // Try to play music immediately (works if context already unlocked)
    this.playMusic();

    // Also listen for first user gesture in case context is still locked
    const startOnGesture = (): void => {
      // Resume suspended context and start music
      const ctx = this.getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => this.playMusic());
      } else {
        this.playMusic();
      }
      document.removeEventListener('click', startOnGesture);
      document.removeEventListener('touchstart', startOnGesture);
      document.removeEventListener('keydown', startOnGesture);
    };
    document.addEventListener('click', startOnGesture);
    document.addEventListener('touchstart', startOnGesture);
    document.addEventListener('keydown', startOnGesture);
  }

  setEnabled(enabled: boolean): void {
    this._enabled = enabled;
    Howler.mute(!enabled);
    if (!enabled) {
      this.stopMusic();
    } else {
      this.playMusic();
    }
  }

  playSfx(name: SfxName): void {
    if (!this._enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      switch (name) {
        case 'spin': this._playSpin(ctx); break;
        case 'reelStop': this._playReelStop(ctx); break;
        case 'win': this._playWin(ctx); break;
        case 'bigWin': this._playBigWin(ctx); break;
        case 'scatter': this._playScatter(ctx); break;
        case 'freeSpinsIntro': this._playFreeSpinsIntro(ctx); break;
      }
    } catch {
      // Silently fail if Web Audio not available
    }
  }

  /** Spin sound - mechanical rolling/whooshing with filtered white noise */
  private _playSpin(ctx: AudioContext): void {
    const duration = 0.3;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + duration);
    filter.Q.value = 2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + duration);
  }

  /** Reel stop - satisfying low-frequency impact with brief click */
  private _playReelStop(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const duration = 0.1;

    // Low frequency thud
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.08);
    osc.type = 'sine';

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.12, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(oscGain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);

    // Click texture from noise burst
    const clickLen = Math.floor(ctx.sampleRate * 0.015);
    const clickBuf = ctx.createBuffer(1, clickLen, ctx.sampleRate);
    const clickData = clickBuf.getChannelData(0);
    for (let i = 0; i < clickLen; i++) {
      clickData[i] = (Math.random() * 2 - 1) * (1 - i / clickLen);
    }
    const clickSrc = ctx.createBufferSource();
    clickSrc.buffer = clickBuf;

    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'highpass';
    clickFilter.frequency.value = 2000;

    const clickGain = ctx.createGain();
    clickGain.gain.value = 0.06;

    clickSrc.connect(clickFilter).connect(clickGain).connect(ctx.destination);
    clickSrc.start(now);
    clickSrc.stop(now + 0.015);
  }

  /** Win sound - ascending melodic chime sequence (C5, E5, G5, C6) */
  private _playWin(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6

    notes.forEach((freq, i) => {
      const startTime = now + i * 0.12;
      const noteDuration = 0.35;

      // Fundamental
      const osc = ctx.createOscillator();
      osc.frequency.value = freq;
      osc.type = 'sine';

      // Inharmonic partial for bell timbre
      const osc2 = ctx.createOscillator();
      osc2.frequency.value = freq * 2.5;
      osc2.type = 'sine';

      const gain1 = ctx.createGain();
      gain1.gain.setValueAtTime(0.1, startTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.03, startTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

      osc.connect(gain1).connect(ctx.destination);
      osc2.connect(gain2).connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + noteDuration);
      osc2.start(startTime);
      osc2.stop(startTime + noteDuration);
    });
  }

  /** Big win - dramatic fanfare with chord progression */
  private _playBigWin(ctx: AudioContext): void {
    const now = ctx.currentTime;

    // Rising sweep
    const sweepOsc = ctx.createOscillator();
    sweepOsc.type = 'sawtooth';
    sweepOsc.frequency.setValueAtTime(100, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
    const sweepGain = ctx.createGain();
    sweepGain.gain.setValueAtTime(0.06, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    const sweepFilter = ctx.createBiquadFilter();
    sweepFilter.type = 'lowpass';
    sweepFilter.frequency.setValueAtTime(400, now);
    sweepFilter.frequency.exponentialRampToValueAtTime(4000, now + 0.3);
    sweepOsc.connect(sweepFilter).connect(sweepGain).connect(ctx.destination);
    sweepOsc.start(now);
    sweepOsc.stop(now + 0.35);

    // Chord progression: C major -> G major -> C5
    const chords = [
      { notes: [262, 330, 392], time: 0.2 },  // C4 E4 G4
      { notes: [294, 370, 440], time: 0.5 },  // D4 F#4 A4 (leading)
      { notes: [330, 392, 523], time: 0.8 },  // E4 G4 C5 (resolution)
    ];

    chords.forEach(({ notes, time }) => {
      const chordStart = now + time;
      const chordDuration = 0.4;
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.frequency.value = freq;
        osc.type = 'sine';
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.07, chordStart);
        gain.gain.exponentialRampToValueAtTime(0.001, chordStart + chordDuration);
        osc.connect(gain).connect(ctx.destination);
        osc.start(chordStart);
        osc.stop(chordStart + chordDuration);

        // Bell harmonic
        const osc2 = ctx.createOscillator();
        osc2.frequency.value = freq * 2.5;
        osc2.type = 'sine';
        const gain2 = ctx.createGain();
        gain2.gain.setValueAtTime(0.02, chordStart);
        gain2.gain.exponentialRampToValueAtTime(0.001, chordStart + chordDuration * 0.6);
        osc2.connect(gain2).connect(ctx.destination);
        osc2.start(chordStart);
        osc2.stop(chordStart + chordDuration);
      });
    });

    // Final sparkle
    const sparkleNotes = [1047, 1319, 1568, 2093];
    sparkleNotes.forEach((freq, i) => {
      const t = now + 1.1 + i * 0.06;
      const osc = ctx.createOscillator();
      osc.frequency.value = freq;
      osc.type = 'sine';
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  /** Scatter sound - mystical metallic shimmer with tremolo */
  private _playScatter(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const duration = 0.6;

    // Multiple detuned sine waves for shimmer
    const baseFreqs = [1200, 1507, 1897, 2400];
    baseFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = freq;
      osc.type = 'sine';

      // Tremolo via LFO
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 8 + Math.random() * 4;
      lfo.type = 'sine';

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.02;

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.04, now);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      lfo.connect(lfoGain);
      lfoGain.connect(mainGain.gain);

      osc.connect(mainGain).connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
      lfo.start(now);
      lfo.stop(now + duration);
    });

    // Pitch-descending metallic ping
    const ping = ctx.createOscillator();
    ping.frequency.setValueAtTime(3000, now);
    ping.frequency.exponentialRampToValueAtTime(1500, now + duration);
    ping.type = 'sine';
    const pingGain = ctx.createGain();
    pingGain.gain.setValueAtTime(0.03, now);
    pingGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    ping.connect(pingGain).connect(ctx.destination);
    ping.start(now);
    ping.stop(now + duration);
  }

  /** Free spins intro - rising sweep + chord hit + sparkle */
  private _playFreeSpinsIntro(ctx: AudioContext): void {
    const now = ctx.currentTime;

    // Rising sweep
    const sweep = ctx.createOscillator();
    sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(80, now);
    sweep.frequency.exponentialRampToValueAtTime(1200, now + 0.5);

    const sweepFilter = ctx.createBiquadFilter();
    sweepFilter.type = 'lowpass';
    sweepFilter.frequency.setValueAtTime(300, now);
    sweepFilter.frequency.exponentialRampToValueAtTime(5000, now + 0.5);

    const sweepGain = ctx.createGain();
    sweepGain.gain.setValueAtTime(0.07, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    sweep.connect(sweepFilter).connect(sweepGain).connect(ctx.destination);
    sweep.start(now);
    sweep.stop(now + 0.55);

    // Impact chord hit at peak (C major spread)
    const hitTime = now + 0.45;
    const hitNotes = [262, 330, 392, 523, 659];
    hitNotes.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = freq;
      osc.type = 'sine';
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, hitTime);
      gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(hitTime);
      osc.stop(hitTime + 0.5);
    });

    // Sparkle cascade
    const sparkleFreqs = [1047, 1319, 1568, 2093, 2637];
    sparkleFreqs.forEach((freq, i) => {
      const t = now + 0.55 + i * 0.08;
      const osc = ctx.createOscillator();
      osc.frequency.value = freq;
      osc.type = 'sine';
      const osc2 = ctx.createOscillator();
      osc2.frequency.value = freq * 2.5;
      osc2.type = 'sine';

      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.05, t);
      g1.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.015, t);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(g1).connect(ctx.destination);
      osc2.connect(g2).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
      osc2.start(t);
      osc2.stop(t + 0.2);
    });
  }

  /** Continuous reel spinning sound - mechanical hum with rhythmic clicking */
  startSpinLoop(): void {
    if (!this._enabled || this._spinLoopPlaying) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      this._spinLoopPlaying = true;

      // Low-frequency mechanical hum (motor sound)
      const motorOsc = ctx.createOscillator();
      motorOsc.type = 'sawtooth';
      motorOsc.frequency.value = 85;

      const motorFilter = ctx.createBiquadFilter();
      motorFilter.type = 'lowpass';
      motorFilter.frequency.value = 300;
      motorFilter.Q.value = 3;

      const motorGain = ctx.createGain();
      motorGain.gain.value = 0.04;

      motorOsc.connect(motorFilter).connect(motorGain).connect(ctx.destination);
      motorOsc.start();

      this._spinLoopNodes.push(motorOsc, motorFilter, motorGain);

      // Higher harmonic whir for reels spinning
      const whirOsc = ctx.createOscillator();
      whirOsc.type = 'triangle';
      whirOsc.frequency.value = 220;

      // Wobble LFO for organic feel
      const wobbleLfo = ctx.createOscillator();
      wobbleLfo.type = 'sine';
      wobbleLfo.frequency.value = 6;
      const wobbleGain = ctx.createGain();
      wobbleGain.gain.value = 15;
      wobbleLfo.connect(wobbleGain);
      wobbleGain.connect(whirOsc.frequency);

      const whirFilter = ctx.createBiquadFilter();
      whirFilter.type = 'bandpass';
      whirFilter.frequency.value = 400;
      whirFilter.Q.value = 2;

      const whirGain = ctx.createGain();
      whirGain.gain.value = 0.025;

      whirOsc.connect(whirFilter).connect(whirGain).connect(ctx.destination);
      whirOsc.start();
      wobbleLfo.start();

      this._spinLoopNodes.push(whirOsc, wobbleLfo, wobbleGain, whirFilter, whirGain);

      // Looping click pattern (symbol ticks) using noise bursts
      const clickLoop = (): void => {
        if (!this._spinLoopPlaying) return;
        try {
          const cCtx = this.getContext();
          if (!cCtx) return;
          const now = cCtx.currentTime;

          // Quick tick sound
          const tickLen = Math.floor(cCtx.sampleRate * 0.008);
          const tickBuf = cCtx.createBuffer(1, tickLen, cCtx.sampleRate);
          const tickData = tickBuf.getChannelData(0);
          for (let i = 0; i < tickLen; i++) {
            tickData[i] = (Math.random() * 2 - 1) * (1 - i / tickLen);
          }
          const tickSrc = cCtx.createBufferSource();
          tickSrc.buffer = tickBuf;

          const tickFilter = cCtx.createBiquadFilter();
          tickFilter.type = 'bandpass';
          tickFilter.frequency.value = 1500 + Math.random() * 500;
          tickFilter.Q.value = 1.5;

          const tickGain = cCtx.createGain();
          tickGain.gain.value = 0.03 + Math.random() * 0.02;

          tickSrc.connect(tickFilter).connect(tickGain).connect(cCtx.destination);
          tickSrc.start(now);
          tickSrc.stop(now + 0.008);
        } catch {
          // ignore
        }
      };

      // Ticks at ~25 per second (simulating symbols flying past)
      clickLoop();
      const clickInterval = setInterval(clickLoop, 40);
      // Store interval ID as a node-like object for cleanup
      this._spinLoopNodes.push({
        stop: () => clearInterval(clickInterval),
        disconnect: () => {}
      } as any);
    } catch {
      // Silently fail
    }
  }

  stopSpinLoop(): void {
    this._spinLoopPlaying = false;
    this._spinLoopNodes.forEach((node) => {
      try {
        if (node instanceof AudioBufferSourceNode || node instanceof OscillatorNode) {
          node.stop();
        }
        if ('stop' in node && typeof (node as any).stop === 'function' &&
            !(node instanceof AudioBufferSourceNode) && !(node instanceof OscillatorNode)) {
          (node as any).stop();
        }
        node.disconnect();
      } catch {
        // already stopped
      }
    });
    this._spinLoopNodes = [];
  }

  /** Background music - ambient jungle-themed loop with subtle rhythm */
  playMusic(): void {
    if (!this._enabled || this._musicPlaying) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      this._musicPlaying = true;

      // Ambient pad: low oscillators with slow modulation
      const padFreqs = [65, 98, 131]; // C2, G2, C3
      padFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.frequency.value = freq;
        osc.type = 'sine';

        // Slow tremolo for organic feel
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.3 + Math.random() * 0.3;
        lfo.type = 'sine';
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.01;

        const mainGain = ctx.createGain();
        mainGain.gain.value = 0.035;

        lfo.connect(lfoGain);
        lfoGain.connect(mainGain.gain);
        osc.connect(mainGain).connect(ctx.destination);

        osc.start();
        lfo.start();

        this._musicNodes.push(osc, lfo, mainGain);
      });

      // Subtle filtered noise rhythm (distant drums pattern)
      const loopDrums = (): void => {
        if (!this._musicPlaying) return;
        try {
          const drumCtx = this.getContext();
          if (!drumCtx) return;
          const now = drumCtx.currentTime;

          // Kick-like hit
          const kickOsc = drumCtx.createOscillator();
          kickOsc.frequency.setValueAtTime(80, now);
          kickOsc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
          kickOsc.type = 'sine';
          const kickGain = drumCtx.createGain();
          kickGain.gain.setValueAtTime(0.04, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          kickOsc.connect(kickGain).connect(drumCtx.destination);
          kickOsc.start(now);
          kickOsc.stop(now + 0.12);

          // Soft noise hit offset (like a shaker)
          const shakerLen = Math.floor(drumCtx.sampleRate * 0.04);
          const shakerBuf = drumCtx.createBuffer(1, shakerLen, drumCtx.sampleRate);
          const shakerData = shakerBuf.getChannelData(0);
          for (let i = 0; i < shakerLen; i++) {
            shakerData[i] = (Math.random() * 2 - 1) * (1 - i / shakerLen);
          }
          const shaker = drumCtx.createBufferSource();
          shaker.buffer = shakerBuf;
          const shakerFilter = drumCtx.createBiquadFilter();
          shakerFilter.type = 'highpass';
          shakerFilter.frequency.value = 3000;
          const shakerGain = drumCtx.createGain();
          shakerGain.gain.value = 0.02;
          shaker.connect(shakerFilter).connect(shakerGain).connect(drumCtx.destination);
          shaker.start(now + 0.4);
          shaker.stop(now + 0.44);
        } catch {
          // ignore
        }
      };

      // Start rhythm loop at ~75 BPM (800ms per beat)
      loopDrums();
      this._musicInterval = setInterval(loopDrums, 800);
    } catch {
      // Silently fail
    }
  }

  stopMusic(): void {
    this._musicPlaying = false;

    if (this._musicInterval !== null) {
      clearInterval(this._musicInterval);
      this._musicInterval = null;
    }

    this._musicNodes.forEach((node) => {
      try {
        if (node instanceof AudioBufferSourceNode || node instanceof OscillatorNode) {
          node.stop();
        }
        node.disconnect();
      } catch {
        // already stopped
      }
    });
    this._musicNodes = [];
  }
}

export const audioManager = new AudioManager();
