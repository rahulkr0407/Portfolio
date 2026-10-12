import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaletteService {
  readonly open = signal(false);

  toggle(): void {
    this.open.update((value) => !value);
  }

  show(): void {
    this.open.set(true);
  }

  hide(): void {
    this.open.set(false);
  }
}