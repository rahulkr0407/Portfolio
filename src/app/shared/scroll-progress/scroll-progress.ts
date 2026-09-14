import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-progress',
  templateUrl: './scroll-progress.html',
  styleUrl: './scroll-progress.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollProgress {
  protected readonly progress = signal(0);
  private frame = 0;
  private measure() {
    if (this.frame) {
      return;
    }
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      this.progress.set(max > 0 ? (window.scrollY / max) * 100 : 0);
    });
  }

  @HostListener('window:scroll')
  protected onScroll() {
    this.measure();
  }

  @HostListener('window:resize')
  protected onResize() {
    this.measure();
  }
}