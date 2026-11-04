/**
 * Sound Effects Engine using the Web Audio API
 * Generates realistic, crisp, zero-latency bubble pop and water droplet sounds
 * without needing external MP3/WAV files that might fail to load.
 */

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sadiqabad_hostel_sound_enabled');
      this.enabled = saved !== 'false'; // Default to true
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      try {
        this.ctx = new AudioCtx();
      } catch {
        return null;
      }
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enable: boolean) {
    this.enabled = enable;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sadiqabad_hostel_sound_enabled', enable ? 'true' : 'false');
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    if (this.enabled) {
      this.playBubblePop(1.1);
    }
    return this.enabled;
  }

  /**
   * Plays a crisp, satisfying, organic bubble pop sound.
   * Pitch is slightly randomized on each click for natural sound variety.
   */
  public playBubblePop(customPitchMultiplier: number = 1.0) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Slight pitch variation (0.92 to 1.08) so repeated clicks sound organic
      const randomJitter = 0.92 + Math.random() * 0.16;
      const baseFreq = 420 * customPitchMultiplier * randomJitter;

      // Primary Bubble Pop Oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Bandpass filter to give realistic aqueous bubble resonance
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq * 1.5, now);
      filter.Q.setValueAtTime(3.0, now);

      osc.type = 'sine';
      // Rapid upward frequency sweep characteristic of a water bubble popping
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.6, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.09);

      // Volume envelope: sharp attack, immediate pop, smooth release
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.28, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);

      // Subtle high-frequency secondary snap for crisp tactile feedback
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(1400 * randomJitter, now);
      snapOsc.frequency.exponentialRampToValueAtTime(2400, now + 0.03);

      snapGain.gain.setValueAtTime(0.08, now);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);

      snapOsc.start(now);
      snapOsc.stop(now + 0.04);
    } catch {
      // Audio playback fails gracefully if browser restricts
    }
  }

  /**
   * Plays a double cheerful bubble chime for success, bookings, or inquiries
   */
  public playSuccessBubble() {
    if (!this.enabled) return;
    this.playBubblePop(0.95);
    setTimeout(() => {
      this.playBubblePop(1.25);
    }, 70);
    setTimeout(() => {
      this.playBubblePop(1.55);
    }, 140);
  }
}

export const soundEffects = new SoundEffectsEngine();
