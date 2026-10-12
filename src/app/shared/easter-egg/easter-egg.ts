import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { HudService } from '../../core/services/hud.service';
import { PaletteService } from '../../core/services/palette.service';
import { SoundService } from '../../core/services/sound.service';
import { Icon } from '../icon/icon';

const CODE = '0407';

@Component({
  selector: 'app-easter-egg',
  templateUrl: './easter-egg.html',
  styleUrl: './easter-egg.css',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EasterEgg implements OnDestroy {
  protected readonly visible = signal(false);

  private readonly hud = inject(HudService);
  private readonly palette = inject(PaletteService);
  private readonly sound = inject(SoundService);

  private buffer = '';
  private hideTimer: ReturnType<typeof setTimeout> | undefined;
  private glitchTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    document.addEventListener('keydown', this.onKey);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKey);
    clearTimeout(this.hideTimer);
    clearTimeout(this.glitchTimer);
    document.documentElement.classList.remove('is-glitch');
  }

  protected dismiss(): void {
    this.visible.set(false);
    clearTimeout(this.hideTimer);
  }

  private readonly onKey = (event: KeyboardEvent): void => {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }
    const target = event.target as HTMLElement | null;
    if (
      target?.tagName === 'INPUT' ||
      target?.tagName === 'TEXTAREA' ||
      target?.tagName === 'SELECT' ||
      target?.isContentEditable ||
      this.palette.open()
    ) {
      return;
    }
    if (event.key.length !== 1) {
      return;
    }

    this.buffer = (this.buffer + event.key).slice(-CODE.length);
    if (this.buffer === CODE && !this.visible()) {
      this.unlock();
    }
  };

  private unlock(): void {
    if (!this.hud.introVisible()) {
      this.sound.play('unlock');
    }
    this.visible.set(true);
    document.documentElement.classList.add('is-glitch');
    this.glitchTimer = setTimeout(() => {
      document.documentElement.classList.remove('is-glitch');
    }, 720);
    this.hideTimer = setTimeout(() => this.visible.set(false), 5200);
  }
}