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