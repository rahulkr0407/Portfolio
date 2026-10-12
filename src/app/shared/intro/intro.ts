import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { HudService } from '../../core/services/hud.service';
import { Icon } from '../icon/icon';

const BOOT_LINES = [
  '> LOAD PORTFOLIO.SYS … OK',
  '> VERIFY ROLE: FRONTEND DEVELOPER … OK',
  '> LINK TCS · SYSTEMS ENGINEER … OK',
  '> SYNC 7 MODULES … OK',
];

const BOOT_STEP_DELAY = 300;
const BOOT_READY_DELAY = 340;
const EXIT_DELAY = 480;

@Component({
  selector: 'app-intro',
  templateUrl: './intro.html',
  styleUrl: './intro.css',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Intro implements OnInit, OnDestroy {
  protected readonly bootLines = BOOT_LINES;
  protected readonly bootCount = signal(0);
  protected readonly booted = signal(false);
  protected readonly closing = signal(false);

  private readonly hud = inject(HudService);
  protected readonly visible = this.hud.introVisible;
  protected readonly optedOut = this.hud.introOptedOut;
  private readonly host: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private previouslyFocused: HTMLElement | null = null;
  private bootTimer: ReturnType<typeof setTimeout> | null = null;
  private exitTimer: ReturnType<typeof setTimeout> | null = null;

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.visible()) {
      this.dismiss();
    }
  }

  @HostListener('document:keydown', ['$event'])
  protected trapFocus(event: KeyboardEvent): void {
    if (!this.visible() || this.closing() || event.key !== 'Tab') {
      return;
    }
    const focusable = this.host.querySelectorAll<HTMLElement>('button, input[type="checkbox"]');
    if (focusable.length === 0) {
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const { activeElement } = document;
    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  ngOnInit(): void {
    if (!this.visible()) {
      return;
    }
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.classList.add('modal-open');
    queueMicrotask(() => {
      this.host.querySelector<HTMLElement>('[data-intro-skip]')?.focus();
    });
    this.runBoot();
  }

  ngOnDestroy(): void {
    if (this.bootTimer !== null) {
      clearTimeout(this.bootTimer);
    }
    if (this.exitTimer !== null) {
      clearTimeout(this.exitTimer);
    }
  }

  protected onBackdrop(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('intro')) {
      this.dismiss();
    }
  }

  protected toggleOptOut(event: Event): void {
    this.hud.setIntroOptOut((event.target as HTMLInputElement).checked);
    if ((event.target as HTMLInputElement).checked) {
      this.dismiss();
    }
  }

  protected dismiss(): void {
    if (!this.visible() || this.closing()) {
      return;
    }
    this.closing.set(true);
    this.exitTimer = setTimeout(() => {
      this.hud.markIntroSeen();
      document.body.classList.remove('modal-open');
      this.previouslyFocused?.focus();
      this.closing.set(false);
    }, EXIT_DELAY);
  }

  private runBoot(): void {
    const total = this.bootLines.length;
    let index = 0;
    const step = () => {
      this.bootCount.set(index + 1);
      index += 1;
      if (index < total) {
        this.bootTimer = setTimeout(step, BOOT_STEP_DELAY);
        return;
      }
      this.bootTimer = setTimeout(() => {
        this.booted.set(true);
        requestAnimationFrame(() => {
          const target =
            this.host.querySelector<HTMLElement>('[data-intro-enter]') ??
            this.host.querySelector<HTMLElement>('[data-intro-skip]');
          target?.focus();
        });
      }, BOOT_READY_DELAY);
    };
    step();
  }
}