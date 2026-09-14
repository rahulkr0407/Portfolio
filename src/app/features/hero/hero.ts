import { ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { profile } from '../../core/data/profile';
import { Button } from '../../shared/button/button';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  imports: [Button, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero implements OnDestroy {
  protected readonly profile = profile;
  protected readonly typed = signal('');
  protected readonly caretVisible = signal(true);

  private readonly roles = profile.roles;
  private roleIndex = 0;
  private deleting = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private readonly typeDelay = 24;
  private readonly deleteDelay = 16;
  private readonly holdDelay = 2200;
  private readonly pauseDelay = 420;

  constructor() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.typed.set(this.roles[0]);
      this.caretVisible.set(false);
      return;
    }
    this.tick();
  }

  ngOnDestroy(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }
  }

  private tick(): void {
    const role = this.roles[this.roleIndex];
    const text = this.typed();

    if (!this.deleting) {
      if (text.length < role.length) {
        this.typed.set(role.slice(0, text.length + 1));
        this.timer = setTimeout(() => this.tick(), this.typeDelay);
        return;
      }
      this.deleting = true;
      this.timer = setTimeout(() => this.tick(), this.holdDelay);
      return;
    }

    if (text.length > 0) {
      this.typed.set(role.slice(0, text.length - 1));
      this.timer = setTimeout(() => this.tick(), this.deleteDelay);
      return;
    }

    this.deleting = false;
    this.roleIndex = (this.roleIndex + 1) % this.roles.length;
    this.timer = setTimeout(() => this.tick(), this.pauseDelay);
  }
}