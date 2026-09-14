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

  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly activeId = signal('');

  protected readonly themeModes: ThemeMode[] = ['system', 'dark', 'light'];
  protected readonly themeIcons: IconName[] = ['monitor', 'moon', 'sun'];

  private spy: IntersectionObserver | undefined;

  constructor() {
    this.syncScroll();
  }

  ngAfterViewInit(): void {
    this.spy = this.initScrollSpy();
  }

  ngOnDestroy(): void {
    this.spy?.disconnect();
  }

  @HostListener('window:scroll')
  protected syncScroll(): void {
    const next = window.scrollY > 8;
    if (this.scrolled() !== next) {
      this.scrolled.set(next);
    }
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
    this.menuOpen.set(!this.menuOpen());
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected cycleTheme(): void {
    this.theme.cycle();
  }
}