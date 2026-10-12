import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { profile } from '../../core/data/profile';
import { HudService } from '../../core/services/hud.service';
import { PaletteService } from '../../core/services/palette.service';
import { SoundService } from '../../core/services/sound.service';
import { ThemeService } from '../../core/services/theme.service';
import { Icon, type IconName } from '../icon/icon';

interface CommandItem {
  id: string;
  label: string;
  group: 'Navigate' | 'Actions';
  icon: IconName;
  run: () => void;
}

@Component({
  selector: 'app-command-palette',
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.css',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPalette {
  protected readonly palette = inject(PaletteService);
  private readonly hud = inject(HudService);
  private readonly theme = inject(ThemeService);
  private readonly sound = inject(SoundService);
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

  protected readonly query = signal('');
  protected readonly activeIndex = signal(0);

  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('search');
  private previouslyFocused: HTMLElement | null = null;

  private readonly navIcons: Record<string, IconName> = {
    home: 'target',
    about: 'user',
    skills: 'cpu',
    projects: 'briefcase',
    experience: 'git-branch',
    contact: 'mail',
  };

  protected readonly allItems = computed<CommandItem[]>(() => [
    ...profile.navLinks.map((link) => ({
      id: `nav-${link.id}`,
      label: `Go to ${link.label}`,
      group: 'Navigate' as const,
      icon: this.navIcons[link.id] ?? 'arrow-right',
      run: () => this.scrollTo(link.id),
    })),
    {
      id: 'action-theme',
      label: 'Cycle color theme',
      group: 'Actions',
      icon: 'sparkles',
      run: () => this.theme.cycle(),
    },
    {
      id: 'action-sound',
      label: this.hud.soundEnabled() ? 'Turn sound off' : 'Turn sound on',
      group: 'Actions',
      icon: 'volume',
      run: () => this.hud.setSoundEnabled(!this.hud.soundEnabled()),
    },
    {
      id: 'action-resume',
      label: 'Download resume',
      group: 'Actions',
      icon: 'download',
      run: () => window.open('/Rahul_Kumar_Resume.pdf', '_blank', 'noopener'),
    },
    {
      id: 'action-email',
      label: 'Email Rahul',
      group: 'Actions',
      icon: 'mail',
      run: () => {
        window.location.href = `mailto:${profile.email}`;
      },
    },
    {
      id: 'action-chat',
      label: 'Ask RK — AI assistant',
      group: 'Actions',
      icon: 'brain',
      run: () => document.getElementById('aw-trigger')?.click(),
    },
  ]);

  protected readonly results = computed(() => {
    const term = this.query().trim().toLowerCase();
    if (!term) {
      return this.allItems();
    }
    return this.allItems().filter((item) => item.label.toLowerCase().includes(term));
  });

  protected readonly grouped = computed(() => {
    const items = this.results();
    const groups: { name: string; items: CommandItem[] }[] = [];
    for (const item of items) {
      const existing = groups.find((group) => group.name === item.group);
      if (existing) {
        existing.items.push(item);
      } else {
        groups.push({ name: item.group, items: [item] });
      }
    }
    return groups;
  });

  constructor() {
    effect(() => {
      const open = this.palette.open();
      if (open) {
        this.previouslyFocused = document.activeElement as HTMLElement | null;
        this.query.set('');
        this.activeIndex.set(0);
        document.body.classList.add('modal-open');
        this.sound.play('open');
        queueMicrotask(() => this.inputRef()?.nativeElement.focus());
      } else {
        document.body.classList.remove('modal-open');
        this.previouslyFocused?.focus();
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  protected onGlobalKey(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (!this.hud.introVisible()) {
        this.palette.toggle();
      }
      return;
    }
    if (event.key === 'Escape' && this.palette.open()) {
      event.preventDefault();
      this.close();
    }
  }

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeIndex.set(0);
  }

  protected onListKey(event: KeyboardEvent): void {
    const items = this.results();
    if (items.length === 0) {
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.set((this.activeIndex() + 1) % items.length);
        this.sound.play('move');
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.set((this.activeIndex() - 1 + items.length) % items.length);
        this.sound.play('move');
        break;
      case 'Enter':
        event.preventDefault();
        this.run(items[this.activeIndex()]);
        break;
      case 'Tab':
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  protected activeDescendant(): string | null {
    const item = this.results()[this.activeIndex()];
    return item ? `palette-${item.id}` : null;
  }

  protected run(item: CommandItem): void {
    this.sound.play('select');
    this.palette.hide();
    item.run();
  }

  protected isActive(item: CommandItem): boolean {
    return this.results()[this.activeIndex()]?.id === item.id;
  }

  protected setActive(index: number): void {
    this.activeIndex.set(index);
  }

  protected close(): void {
    this.sound.play('close');
    this.palette.hide();
  }

  private scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}