import { Directive, ElementRef, inject, input, type OnInit } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
})
export class ScrollReveal implements OnInit {
  readonly delay = input(0, { alias: 'appScrollRevealDelay' });

  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;

  ngOnInit(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      this.element.classList.add('is-visible');
      return;
    }

    this.element.classList.add('js-reveal');
    if (this.delay()) {
      this.element.style.transitionDelay = `${this.delay()}ms`;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.element.classList.add('is-visible');
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -48px 0px', threshold: 0.12 },
    );
    observer.observe(this.element);
  }
}