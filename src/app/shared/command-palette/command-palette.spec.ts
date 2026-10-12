import { TestBed } from '@angular/core/testing';
import { PaletteService } from '../../core/services/palette.service';
import { CommandPalette } from './command-palette';

describe('CommandPalette', () => {
  let palette: PaletteService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandPalette],
    }).compileComponents();
    palette = TestBed.inject(PaletteService);
    palette.hide();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CommandPalette);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render nothing while closed', () => {
    const fixture = TestBed.createComponent(CommandPalette);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.palette')).toBeFalsy();
  });

  it('should open on Ctrl+K and focus the search input', async () => {
    const fixture = TestBed.createComponent(CommandPalette);
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    fixture.detectChanges();
    await Promise.resolve();
    expect(fixture.nativeElement.querySelector('.palette')).toBeTruthy();
    expect(document.activeElement?.classList.contains('palette__input')).toBeTrue();
  });

  it('should filter commands by query', () => {
    const fixture = TestBed.createComponent(CommandPalette);
    fixture.detectChanges();
    palette.show();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('.palette__input') as HTMLInputElement;
    input.value = 'resume';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.palette__item');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Download resume');
  });

  it('should close on Escape and release the scroll lock', () => {
    const fixture = TestBed.createComponent(CommandPalette);
    fixture.detectChanges();
    palette.show();
    fixture.detectChanges();
    expect(document.body.classList.contains('modal-open')).toBeTrue();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.palette')).toBeFalsy();
    expect(document.body.classList.contains('modal-open')).toBeFalse();
  });
});