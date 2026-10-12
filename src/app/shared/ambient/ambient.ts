import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  viewChild,
} from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

@Component({
  selector: 'app-ambient',
  templateUrl: './ambient.html',
  styleUrl: './ambient.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ambient implements AfterViewInit, OnDestroy {
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

  private context: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private frameId = 0;
  private resizeObserver: ResizeObserver | undefined;
  private dots: string[] = [];
  private lineColor = '';
  private reducedMotion = false;
  private running = false;
  private width = 0;
  private height = 0;
  private dpr = 1;

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) {
      return;
    }
    this.context = canvas.getContext('2d');
    if (!this.context) {
      return;
    }

    this.readPalette();
    this.resize();
    this.seed();
    this.draw();
    this.resume();

    this.resizeObserver = new ResizeObserver(() => {
      this.readPalette();
      this.resize();
      this.seed();
      if (this.reducedMotion) {
        this.draw();
      }
    });
    this.resizeObserver.observe(document.documentElement);
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frameId);
    this.resizeObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private readonly onVisibility = (): void => {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  };

  private readPalette(): void {
    const styles = getComputedStyle(this.host);
    const accent = styles.getPropertyValue('--accent').trim() || '#38bdf8';
    const accent2 = styles.getPropertyValue('--accent-2').trim() || '#a855f7';
    this.dots = [accent, accent2];
    this.lineColor = accent;
  }

  private resize(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) {
      return;
    }
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = Math.floor(this.width * this.dpr);
    canvas.height = Math.floor(this.height * this.dpr);
    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;
    this.context?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private seed(): void {
    const count = this.reducedMotion
      ? 16
      : Math.min(56, Math.max(20, Math.round((this.width * this.height) / 32000)));
    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.7 + 0.7,
    }));
  }

  private step(): void {
    const connect = 130;
    const ctx = this.context;
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, this.width, this.height);

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < this.particles.length; i++) {
      const a = this.particles[i];
      for (let j = i + 1; j < this.particles.length; j++) {
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < connect) {
          ctx.globalAlpha = (1 - dist / connect) * 0.16;
          ctx.strokeStyle = this.lineColor;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 0.55;
    this.particles.forEach((p, index) => {
      ctx.fillStyle = this.dots[index % this.dots.length];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  private draw(): void {
    this.step();
  }

  private loop = (): void => {
    if (!this.running) {
      return;
    }
    this.step();
    this.frameId = requestAnimationFrame(this.loop);
  };

  private resume(): void {
    if (this.running || this.reducedMotion) {
      return;
    }
    this.running = true;
    this.frameId = requestAnimationFrame(this.loop);
  }

  private pause(): void {
    this.running = false;
    cancelAnimationFrame(this.frameId);
  }
}