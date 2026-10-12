import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { profile } from '../../core/data/profile';
import { HudService } from '../../core/services/hud.service';
import { PaletteService } from '../../core/services/palette.service';
import { SoundService } from '../../core/services/sound.service';
import { ThemeService, type ThemeMode } from '../../core/services/theme.service';
import { Icon, type IconName } from '../icon/icon';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar implements AfterViewInit, OnDestroy {
  protected readonly profile = profile;
  protected readonly theme = inject(ThemeService);
  protected readonly hud = inject(HudService);
  private readonly palette = inject(PaletteService);
  private readonly sound = inject(SoundService);

  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly activeId = signal('');

  protected readonly themeModes: ThemeMode[] = ['system', 'dark', 'light'];
  protected readonly themeIcons: IconName[] = ['monitor', 'moon', 'sun'];

  private spy: IntersectionObserver | undefined;
  private readonly desktopQuery = window.matchMedia('(min-width: 64rem)');

  constructor() {
    this.syncScroll();
    this.desktopQuery.addEventListener('change', (e) => {
      if (e.matches && this.menuOpen()) {
        this.closeMenu();
      }
    });
  }

  ngAfterViewInit(): void {
    this.spy = this.initScrollSpy();
  }

  ngOnDestroy(): void {
    this.spy?.disconnect();
    document.body.classList.remove('modal-open');
  }

  @HostListener('window:scroll')
  protected syncScroll(): void {
    const next = window.scrollY > 8;
    if (this.scrolled() !== next) {
      this.scrolled.set(next);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeMenu();
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeys(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName;
    if (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      target?.isContentEditable
    ) {
      return;
    }
    const digit = Number(event.key);
    const count = this.profile.navLinks.length;
    if (!Number.isInteger(digit) || digit < 1 || digit > count) {
      return;
    }
    if (this.hud.introVisible() || this.palette.open() || document.querySelector('.modal__panel')) {
      return;
    }
    this.closeMenu();
    document
      .getElementById(this.profile.navLinks[digit - 1].id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected openPalette(): void {
    this.palette.show();
  }

  protected toggleSound(): void {
    const next = !this.hud.soundEnabled();
    this.hud.setSoundEnabled(next);
    if (next) {
      this.sound.play('select');
    }
  }

  protected locLabel(): string {
    const index = this.profile.navLinks.findIndex((link) => link.id === this.activeId());
    return String(index >= 0 ? index + 1 : this.profile.navLinks.length).padStart(2, '0');
  }

  protected navCountLabel(): string {
    return String(this.profile.navLinks.length).padStart(2, '0');
  }

  protected linkIndex(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  private initScrollSpy(): IntersectionObserver | undefined {
    if (typeof IntersectionObserver === 'undefined') {
      return undefined;
    }
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main [id]'));
    if (sections.length === 0) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeId.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return observer;
  }

  protected toggleMenu(): void {
    const open = !this.menuOpen();
    this.menuOpen.set(open);
    document.body.classList.toggle('modal-open', open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    document.body.classList.remove('modal-open');
  }

  protected cycleTheme(): void {
    this.theme.cycle();
  }
}