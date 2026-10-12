import { TestBed } from '@angular/core/testing';
import { profile } from '../../core/data/profile';
import { Skills } from './skills';

describe('Skills', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Skills],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Skills);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render one tab per skill branch', () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(profile.skills.length);
  });

  it('should mark the first branch active by default', () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    const active = fixture.nativeElement.querySelector('.tree__branch.is-active');
    expect(active).toBeTruthy();
    expect(active.getAttribute('aria-selected')).toBe('true');
  });

  it('should swap the panel when a branch is selected', () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]') as NodeListOf<HTMLElement>;
    tabs[2].click();
    fixture.detectChanges();
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    const panel = fixture.nativeElement.querySelector('[role="tabpanel"]');
    expect(panel.getAttribute('id')).toBe('skill-panel-2');
    expect(panel.textContent).toContain(profile.skills[2].items[0]);
  });

  it('should navigate branches with arrow keys', () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    const first = tablist.querySelector('[role="tab"]') as HTMLElement;
    first.focus();
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.tree__branch.is-active').getAttribute('aria-selected'),
    ).toBe('true');
    expect(document.activeElement?.id).toBe('skill-tab-1');
  });

  it('should list every unlocked node for the active branch', () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    const nodes = fixture.nativeElement.querySelectorAll('.tree__node');
    expect(nodes.length).toBe(profile.skills[0].items.length);
  });
});