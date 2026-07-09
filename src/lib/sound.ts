'use client';

type SoundType = 'rain' | 'ocean' | 'wind';
type AudioState = 'idle' | 'playing' | 'paused';

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private nodes: AudioNode[] = [];
  private state: AudioState = 'idle';
  private currentType: SoundType = 'rain';
  private gainNode: GainNode | null = null;
  private animId: number | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  start(type: SoundType = 'rain') {
    if (this.state === 'playing' && this.currentType === type) return;
    this.stop();
    this.currentType = type;
    const ctx = this.getContext();
    this.gainNode = ctx.createGain();
    this.gainNode.gain.value = 0;
    this.gainNode.connect(ctx.destination);
    this.gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);

    switch (type) {
      case 'rain': this.buildRain(ctx); break;
      case 'ocean': this.buildOcean(ctx); break;
      case 'wind': this.buildWind(ctx); break;
    }

    this.state = 'playing';
  }

  stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.nodes.forEach((n) => {
      try { n.disconnect(); } catch {}
    });
    this.nodes = [];
    if (this.gainNode) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(0, (this.ctx?.currentTime || 0) + 0.5);
      } catch {}
    }
    this.state = 'idle';
  }

  pause() {
    if (this.state !== 'playing') return;
    if (this.gainNode) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(0, (this.ctx?.currentTime || 0) + 1);
      } catch {}
    }
    this.state = 'paused';
  }

  resume() {
    if (this.state !== 'paused') return;
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 2);
    }
    this.state = 'playing';
  }

  isPlaying() { return this.state === 'playing'; }

  private buildRain(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.value = 8000;

    source.connect(filter);
    filter.connect(filter2);
    filter2.connect(this.gainNode!);
    source.start();
    this.nodes.push(source, filter, filter2);
  }

  private buildOcean(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let phase = 0;
    for (let i = 0; i < bufferSize; i++) {
      phase += 0.5 + Math.sin(i * 0.001) * 0.5;
      data[i] = Math.sin(phase) * (0.3 + Math.sin(i * 0.0005) * 0.3) + (Math.random() - 0.5) * 0.1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    source.connect(filter);
    filter.connect(this.gainNode!);
    source.start();
    this.nodes.push(source, filter);
  }

  private buildWind(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 80;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;

    const gainMod = ctx.createGain();
    gainMod.gain.value = 0.3;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 100;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    osc.connect(filter);
    filter.connect(gainMod);
    gainMod.connect(this.gainNode!);
    osc.start();
    this.nodes.push(osc, filter, gainMod, lfo, lfoGain);
  }
}

export const ambientSound = new AmbientSoundEngine();
