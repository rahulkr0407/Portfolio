import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { profile } from '../../core/data/profile';
import type { Project } from '../../core/data/profile';
import { Button } from '../../shared/button/button';
import { CaseStudyModal } from '../../shared/case-study-modal/case-study-modal';
import { Icon } from '../../shared/icon/icon';
import { ScrollReveal } from '../../shared/scroll-reveal.directive';
import { SectionHead } from '../../shared/section-head/section-head';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  imports: [Button, CaseStudyModal, Icon, ScrollReveal, SectionHead],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  protected readonly profile = profile;
  protected readonly featured = profile.projects.find((p) => p.featured);
  protected readonly secondary = profile.projects.filter((p) => !p.featured);
  protected readonly activeStudy = signal<Project | null>(null);

  protected openStudy(project: Project) {
    if (project.caseStudy) {
      this.activeStudy.set(project);
    }
  }

  protected closeStudy() {
    this.activeStudy.set(null);
  }
}