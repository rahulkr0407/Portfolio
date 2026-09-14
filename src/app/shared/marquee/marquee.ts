import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-marquee',
  templateUrl: './marquee.html',
  styleUrl: './marquee.css',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Marquee {
  readonly items = input<string[]>([]);
  protected readonly reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}