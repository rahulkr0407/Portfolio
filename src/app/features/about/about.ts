import { ChangeDetectionStrategy, Component } from '@angular/core';
import { profile } from '../../core/data/profile';
import { CountUp } from '../../shared/count-up/count-up';
import { ScrollReveal } from '../../shared/scroll-reveal.directive';
import { SectionHead } from '../../shared/section-head/section-head';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrl: './about.css',
  imports: [CountUp, ScrollReveal, SectionHead],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly profile = profile;
}