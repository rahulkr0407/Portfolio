import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-head',
  templateUrl: './section-head.html',
  styleUrl: './section-head.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHead {
  readonly eyebrow = input<string>();
  readonly title = input<string>();
  readonly lead = input<string>();
}