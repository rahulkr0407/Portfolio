import { ChangeDetectionStrategy, Component } from '@angular/core';
import { profile } from '../../core/data/profile';
import { Icon } from '../../shared/icon/icon';
import { ScrollReveal } from '../../shared/scroll-reveal.directive';
import { SectionHead } from '../../shared/section-head/section-head';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.html',
  styleUrl: './experience.css',
  imports: [Icon, ScrollReveal, SectionHead],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience {
  protected readonly profile = profile;
}
