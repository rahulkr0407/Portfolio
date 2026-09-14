import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import type { Project } from '../../core/data/profile';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-case-study-modal',
  templateUrl: './case-study-modal.html',
  styleUrl: './case-study-modal.css',
  imports: [Button, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseStudyModal implements OnInit, OnDestroy {
  readonly project = input.required<Project>();
  readonly closed = output<void>();

  private readonly host: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private previouslyFocused: HTMLElement | null = null;

  @HostListener('document:keydown.escape')
  protected onEscape() {
    this.close();
  }

  @HostListener('document:keydown', ['$event'])
  protected trapFocus(event: KeyboardEvent) {
    if (event.key !== 'Tab') {
      return;
    }
    const focusable = this.host.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) {
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const { activeElement } = document;
    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  protected close() {
    this.closed.emit();
  }

  ngOnInit() {
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.classList.add('modal-open');
    this.host.querySelector<HTMLElement>('button[data-modal-close]')?.focus();
  }

  ngOnDestroy() {
    document.body.classList.remove('modal-open');
    this.previouslyFocused?.focus();
  }
}