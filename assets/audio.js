/**
 * Procedural Web Audio Synthesizer for Rajasthan Royals Dashboard
 * Provides subtle sci-fi UI clicks and stadium crowd cheering without external audio files
 */

class SupeRRAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambienceNode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  toggle() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playBeep(520, 0.08);
      this.startSubtleAmbience();
    } else {
      this.stopAmbience();
    }
    return !this.isMuted;
  }

  playClick() {
    if (this.isMuted || !this.ctx) return;
    this.playBeep(780, 0.04);
  }

  playCardHover() {
    if (this.isMuted || !this.ctx) return;
    this.playBeep(440, 0.03, 0.015);
  }

  playCheer() {
    if (this.isMuted || !this.ctx) return;
    // Synthesize quick white noise burst resembling cheer
    try {
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (e) {}
  }

  playBeep(freq, duration, volume = 0.03) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  startSubtleAmbience() {
    // Gentle pink stadium low hum
    try {
      if (this.ambienceNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(65, this.ctx.currentTime); // Low 65Hz stadium rumble

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      this.ambienceNode = { osc, gain };
    } catch (e) {}
  }

  stopAmbience() {
    if (this.ambienceNode) {
      try {
        this.ambienceNode.osc.stop();
      } catch (e) {}
      this.ambienceNode = null;
    }
  }
}

window.RR_AUDIO = new SupeRRAudio();
