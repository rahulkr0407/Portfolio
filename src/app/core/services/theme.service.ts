import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'system' | 'dark' | 'light';

const STORAGE_KEY = 'theme';
const THEME_MODES: ThemeMode[] = ['system', 'dark', 'light'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(ThemeService.readMode());
  readonly isDark = signal<boolean>(ThemeService.matchesDark(this.mode()));

  private readonly media = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    this.apply(this.mode());
    this.media.addEventListener('change', () => {
      if (this.mode() === 'system') {
        this.apply('system');
      }
    });
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* storage unavailable — keep in-memory only */
    }
    this.apply(mode);
    this.isDark.set(ThemeService.matchesDark(mode));
  }

  cycle(): void {
    const next = THEME_MODES[(THEME_MODES.indexOf(this.mode()) + 1) % THEME_MODES.length];
    this.setMode(next);
  }

  private apply(mode: ThemeMode): void {
    const dark = ThemeService.matchesDark(mode);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.setAttribute('data-theme', mode);
  }

  private static readMode(): ThemeMode {
    const stored = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    })();
    return THEME_MODES.includes(stored as ThemeMode) ? (stored as ThemeMode) : 'system';
  }

  private static matchesDark(mode: ThemeMode): boolean {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}