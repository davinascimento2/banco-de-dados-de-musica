class WebAudioSynthEngine {
  private ctx: AudioContext | null = null;
  public analyser: AnalyserNode | null = null;
  private isPlaying: boolean = false;
  private currentInterval: any = null;
  public onStateChange?: (playing: boolean) => void;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playNotes(sequence: number[], bpm: number = 120) {
    this.initCtx();
    this.stop();

    if (!this.ctx || !this.analyser || sequence.length === 0) return;

    this.isPlaying = true;
    this.onStateChange?.(true);

    const stepDuration = 60 / bpm / 2; // Eighth notes
    let stepIndex = 0;

    const playStep = () => {
      if (!this.isPlaying || !this.ctx || !this.analyser) return;

      const freq = sequence[stepIndex % sequence.length];
      const now = this.ctx.currentTime;

      // Synth Oscillator
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      // Low pass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + stepDuration * 0.9);

      // Amplitude Envelope
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.analyser);

      osc.start(now);
      osc.stop(now + stepDuration);

      stepIndex++;
    };

    playStep();
    this.currentInterval = setInterval(playStep, stepDuration * 1000);
  }

  public stop() {
    this.isPlaying = false;
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
    this.onStateChange?.(false);
  }

  public getFrequencyData(array: any) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioSynth = new WebAudioSynthEngine();
