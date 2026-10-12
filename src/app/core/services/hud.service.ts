import { Injectable, signal } from '@angular/core';

const INTRO_SEEN_KEY = 'hud.intro.seen';
const INTRO_OPT_OUT_KEY = 'hud.intro.optout';
const SOUND_KEY = 'hud.sound';

@Injectable({ providedIn: 'root' })
export class HudService {
  readonly introVisible = signal(false);
  readonly introOptedOut = signal(false);
  readonly soundEnabled = signal(false);

  constructor() {
    this.introOptedOut.set(HudService.readFlag(INTRO_OPT_OUT_KEY));
    this.soundEnabled.set(HudService.readFlag(SOUND_KEY));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seenThisSession = HudService.readFlag(INTRO_SEEN_KEY, true);
    this.introVisible.set(!reducedMotion && !this.introOptedOut() && !seenThisSession);
  }

  markIntroSeen(): void {
    HudService.writeFlag(INTRO_SEEN_KEY, true, true);
    this.introVisible.set(false);
  }

  setIntroOptOut(enabled: boolean): void {
    this.introOptedOut.set(enabled);
    HudService.writeFlag(INTRO_OPT_OUT_KEY, enabled);
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled.set(enabled);
    HudService.writeFlag(SOUND_KEY, enabled);
  }

  private static readFlag(key: string, session = false): boolean {
    try {
      const store = session ? window.sessionStorage : window.localStorage;
      return store.getItem(key) === '1';
    } catch {
      return false;
    }
  }

  private static writeFlag(key: string, enabled: boolean, session = false): void {
    try {
      const store = session ? window.sessionStorage : window.localStorage;
      if (enabled) {
        store.setItem(key, '1');
      } else {
        store.removeItem(key);
      }
    } catch {
      /* storage unavailable — keep in-memory only */
    }
  }
}