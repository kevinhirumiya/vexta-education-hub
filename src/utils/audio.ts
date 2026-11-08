/**
 * Web Audio API synthesizer for focus timer chimes and ambient study sounds.
 * Fully client-side, lightweight, zero external dependencies.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private currentAmbientType: 'rain' | 'tone' | 'whitenoise' | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a soft pleasant Tibetan singing bowl / study chime
  public playChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Base bell tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(528, now); // 528Hz Solfeggio / clear bell frequency

      // Harmonics
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1056, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(ctx.destination);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.6);
      osc2.stop(now + 2.6);
    } catch {
      // Audio not permitted or supported
    }
  }

  // Ambient sound generator
  public startAmbient(type: 'rain' | 'tone' | 'whitenoise', volume = 0.2) {
    try {
      this.stopAmbient();
      const ctx = this.getContext();
      this.currentAmbientType = type;
      this.isAmbientPlaying = true;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      if (type === 'tone') {
        // Deep warm 432 Hz focus binaural carrier
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, ctx.currentTime);

        const subOsc = ctx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(216, ctx.currentTime);

        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.4, ctx.currentTime);

        subOsc.connect(subGain);
        subGain.connect(masterGain);
        osc.connect(masterGain);

        osc.start();
        subOsc.start();
        this.ambientSource = osc;
      } else {
        // Synthesize noise buffer for Rain / White Noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            // Brown / Pink filtered noise with random drops
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          } else {
            // White noise
            output[i] = white * 0.15;
          }
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        if (type === 'rain') {
          // Lowpass filter for smooth rainfall texture
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, ctx.currentTime);
          whiteNoise.connect(filter);
          filter.connect(masterGain);
        } else {
          whiteNoise.connect(masterGain);
        }

        whiteNoise.start();
        this.ambientSource = whiteNoise;
      }
    } catch {
      // Audio context error
    }
  }

  public setAmbientVolume(volume: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public stopAmbient() {
    try {
      if (this.ambientSource) {
        if ('stop' in this.ambientSource && typeof this.ambientSource.stop === 'function') {
          this.ambientSource.stop();
        }
        this.ambientSource.disconnect();
        this.ambientSource = null;
      }
      if (this.ambientGain) {
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
      this.isAmbientPlaying = false;
      this.currentAmbientType = null;
    } catch {
      // Error cleanup
    }
  }

  public getAmbientState() {
    return {
      isPlaying: this.isAmbientPlaying,
      type: this.currentAmbientType,
    };
  }
}

export const audioSynth = new AudioSynthesizer();
