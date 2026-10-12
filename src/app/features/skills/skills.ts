import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { profile } from '../../core/data/profile';
import { Icon } from '../../shared/icon/icon';
import { ScrollReveal } from '../../shared/scroll-reveal.directive';
import { SectionHead } from '../../shared/section-head/section-head';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.html',
  styleUrl: './skills.css',
  imports: [Icon, ScrollReveal, SectionHead],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skills {
  protected readonly profile = profile;
  protected readonly activeIndex = signal(0);

  protected select(index: number): void {
    this.activeIndex.set(index);
  }

  protected onBranchKeys(event: KeyboardEvent): void {
    const last = this.profile.skills.length - 1;
    const current = this.activeIndex();
    let next: number;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = current === last ? 0 : current + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = current === 0 ? last : current - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.activeIndex.set(next);
    document.getElementById(`skill-tab-${next}`)?.focus();
  }
}