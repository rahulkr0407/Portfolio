import { ChangeDetectionStrategy, Component } from '@angular/core';
import { profile } from '../../core/data/profile';
import { Icon } from '../../shared/icon/icon';
import { ScrollReveal } from '../../shared/scroll-reveal.directive';
import { SectionHead } from '../../shared/section-head/section-head';

@Component({
  selector: 'app-education',
  templateUrl: './education.html',
  styleUrl: './education.css',
  imports: [Icon, ScrollReveal, SectionHead],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Education {
  protected readonly profile = profile;
}