import { ChangeDetectionStrategy, Component } from '@angular/core';
import { profile } from '../../core/data/profile';
import { Button } from '../../shared/button/button';
import { Icon } from '../../shared/icon/icon';
import { ScrollReveal } from '../../shared/scroll-reveal.directive';
import { SectionHead } from '../../shared/section-head/section-head';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  imports: [Button, Icon, ScrollReveal, SectionHead],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected readonly profile = profile;
  protected readonly telHref = 'tel:+916299566895';
}