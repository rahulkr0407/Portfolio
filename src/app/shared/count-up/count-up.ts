import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-count-up',
  templateUrl: './count-up.html',
  styleUrl: './count-up.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountUp implements OnInit {
  readonly value = input.required<number>();
  readonly suffix = input('');
  protected readonly display = signal(0);

  private readonly host: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  ngOnInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.display.set(this.value());
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.display.set(this.value());
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            this.run();
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(this.host);
  }

  private run(): void {
    const target = this.value();
    const duration = 1200;
    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      this.display.set(Math.round(target * easeOut(t)));
      if (t < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }
}