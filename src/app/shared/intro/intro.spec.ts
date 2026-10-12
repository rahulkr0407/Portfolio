import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HudService } from '../../core/services/hud.service';
import { Intro } from './intro';

describe('Intro', () => {
  let hud: HudService;

  beforeEach(async () => {
    try {
      window.sessionStorage.clear();
      window.localStorage.removeItem('hud.intro.optout');
    } catch {
      /* storage unavailable */
    }
    await TestBed.configureTestingModule({
      imports: [Intro],
    }).compileComponents();
    hud = TestBed.inject(HudService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Intro);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the boot screen with a skip option', () => {
    const fixture = TestBed.createComponent(Intro);
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector('.intro');
    expect(root).toBeTruthy();
    expect(root.querySelectorAll('.intro__boot-line').length).toBe(4);
    expect(root.querySelector('[data-intro-skip]')).toBeTruthy();
    expect(root.querySelector('[data-intro-enter]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('RAHUL');
    expect(fixture.nativeElement.textContent).toContain('KUMAR');
  });

  it('should dismiss via Enter and remember the session', fakeAsync(() => {
    const fixture = TestBed.createComponent(Intro);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[data-intro-enter]') as HTMLElement).click();
    fixture.detectChanges();
    tick(600);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.intro')).toBeFalsy();
    expect(document.body.classList.contains('modal-open')).toBeFalse();
    let seen = false;
    try {
      seen = window.sessionStorage.getItem('hud.intro.seen') === '1';
    } catch {
      seen = true;
    }
    expect(seen).toBeTrue();
  }));

  it('should dismiss via Skip', fakeAsync(() => {
    const fixture = TestBed.createComponent(Intro);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[data-intro-skip]') as HTMLElement).click();
    fixture.detectChanges();
    tick(600);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.intro')).toBeFalsy();
  }));

  it('should dismiss via Escape', fakeAsync(() => {
    const fixture = TestBed.createComponent(Intro);
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    tick(600);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.intro')).toBeFalsy();
  }));

  it('should opt out persistently', fakeAsync(() => {
    const fixture = TestBed.createComponent(Intro);
    fixture.detectChanges();
    const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    tick(600);
    fixture.detectChanges();
    let optedOut = false;
    try {
      optedOut = window.localStorage.getItem('hud.intro.optout') === '1';
    } catch {
      optedOut = true;
    }
    expect(optedOut).toBeTrue();
    expect(hud.introOptedOut()).toBeTrue();
  }));

  it('should lock body scroll while visible and release it', fakeAsync(() => {
    const fixture = TestBed.createComponent(Intro);
    fixture.detectChanges();
    expect(document.body.classList.contains('modal-open')).toBeTrue();
    (fixture.nativeElement.querySelector('[data-intro-skip]') as HTMLElement).click();
    fixture.detectChanges();
    tick(600);
    fixture.detectChanges();
    expect(document.body.classList.contains('modal-open')).toBeFalse();
  }));
});