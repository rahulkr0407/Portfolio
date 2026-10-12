import { ChangeDetectionStrategy, Component } from '@angular/core';
import { profile } from '../../core/data/profile';
import type { Experience as ExperienceEntry } from '../../core/data/profile';
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

  protected logId(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  protected isActive(job: ExperienceEntry): boolean {
    return /present/i.test(job.duration);
  }
}
