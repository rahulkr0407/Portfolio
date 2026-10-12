import { Injectable, inject } from '@angular/core';
import { HudService } from './hud.service';

export type SoundCue = 'open' | 'close' | 'move' | 'select' | 'unlock';

interface CueSpec {
  freq: number;
  endFreq?: number;
  duration: number;
  type: OscillatorType;
  gain: number;
}

const CUES: Record<SoundCue, CueSpec> = {
  open: { freq: 320, endFreq: 540, duration: 0.14, type: 'triangle', gain: 0.06 },
  close: { freq: 420, endFreq: 240, duration: 0.12, type: 'triangle', gain: 0.05 },
  move: { freq: 620, duration: 0.05, type: 'square', gain: 0.025 },
  select: { freq: 660, endFreq: 990, duration: 0.12, type: 'sine', gain: 0.06 },
  unlock: { freq: 523.25, endFreq: 1046.5, duration: 0.42, type: 'sine', gain: 0.08 },
};

@Injectable({ providedIn: 'root' })
export class SoundService {
  private readonly hud = inject(HudService);
  private context: AudioContext | null = null;

  play(cue: SoundCue): void {
    if (!this.hud.soundEnabled()) {
      return;
    }
    const context = this.ensureContext();
    if (!context) {
      return;
    }
    if (context.state === 'suspended') {
      void context.resume();
    }

    const spec = CUES[cue];
    const now = context.currentTime;
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = spec.type;
    osc.frequency.setValueAtTime(spec.freq, now);
    if (spec.endFreq) {
      osc.frequency.exponentialRampToValueAtTime(spec.endFreq, now + spec.duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(spec.gain, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + spec.duration);

    osc.connect(gain).connect(context.destination);
    osc.start(now);
    osc.stop(now + spec.duration + 0.02);
  }

  private ensureContext(): AudioContext | null {
    if (this.context) {
      return this.context;
    }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) {
      return null;
    }
    try {
      this.context = new Ctor();
      return this.context;
    } catch {
      return null;
    }
  }
}