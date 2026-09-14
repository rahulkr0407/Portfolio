import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName =
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'menu'
  | 'x'
  | 'github'
  | 'linkedin'
  | 'mail'
  | 'arrow-right'
  | 'arrow-up'
  | 'code'
  | 'database'
  | 'git-branch'
  | 'terminal'
  | 'graduation-cap'
  | 'briefcase'
  | 'map-pin'
  | 'phone'
  | 'external-link'
  | 'user'
  | 'sparkles'
  | 'download'
  | 'cloud'
  | 'shield'
  | 'brain'
  | 'layout'
  | 'building-2'
  | 'chevron-right'
  | 'chevron-down';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input<IconName>('menu');
  readonly size = input<number | string>(20);

  protected readonly isFilled = computed(() => this.name() === 'github' || this.name() === 'linkedin');
}