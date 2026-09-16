import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { profile } from '../../core/data/profile';
import { Button } from '../../shared/button/button';
import { Icon } from '../../shared/icon/icon';
import { ScrollReveal } from '../../shared/scroll-reveal.directive';
import { SectionHead } from '../../shared/section-head/section-head';

const FORMSPREE_ENDPOINT = '';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

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
  protected readonly formStatus = signal<FormStatus>('idle');
  protected readonly hasEndpoint = FORMSPREE_ENDPOINT.length > 0;

  protected openChat(): void {
    document.getElementById('aw-trigger')?.click();
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);

    if (data.get('website')) {
      return;
    }

    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    if (!name || !email || !message) {
      return;
    }

    if (this.hasEndpoint) {
      this.formStatus.set('sending');
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
        .then((response) => {
          if (response.ok) {
            form.reset();
            this.formStatus.set('sent');
          } else {
            this.formStatus.set('error');
          }
        })
        .catch(() => this.formStatus.set('error'));
      return;
    }

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    form.reset();
  }
}