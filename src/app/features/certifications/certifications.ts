import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { profile } from '../../core/data/profile';
import type { CertificationEntry } from '../../core/data/profile';
import { Icon } from '../../shared/icon/icon';
import { ScrollReveal } from '../../shared/scroll-reveal.directive';
import { SectionHead } from '../../shared/section-head/section-head';

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.html',
  styleUrl: './certifications.css',
  imports: [Icon, ScrollReveal, SectionHead],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Certifications {
  protected readonly profile = profile;

  protected readonly credentials = computed(() =>
    profile.certifications.filter((cert) => !this.isPlaceholder(cert)),
  );

  private isPlaceholder(cert: CertificationEntry): boolean {
    return (
      /your /i.test(cert.name) ||
      /^issuer(\s|\/)/i.test(cert.issuer) ||
      cert.year === 'YYYY'
    );
  }
}