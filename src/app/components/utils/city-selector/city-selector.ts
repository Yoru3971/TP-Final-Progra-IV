import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeoRefService } from '../../../services/geo-ref-service'; // Ajusta ruta si es necesario
import { GeoCity } from '../../../model/geo-city.model'; // Ajusta ruta

@Component({
  selector: 'app-city-selector',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './city-selector.html',
  styleUrl: './city-selector.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CitySelector),
      multi: true,
    },
  ],
})
export class CitySelector implements OnInit, ControlValueAccessor {
  private geoService = inject(GeoRefService);

  @ViewChild('optionsList') optionsList!: ElementRef;
  @Input() restoreOnBlur: boolean = false;
  private lastValidValue: string = '';

  // --- SIGNALS ---
  allCities = signal<GeoCity[]>([]);
  inputValue = signal<string>(''); // Valor visual del input
  open = signal(false);
  loading = signal(false);
  selectedIndex = signal(-1);

  // --- CVA INTERFACE ---
  onChange = (value: string | null) => {};
  onTouched = () => {};
  isDisabled = false;

  // --- COMPUTED (Filtrado) ---
  filteredCities = computed(() => {
    const rawTerm = this.inputValue();
    const term = this.normalizeText(rawTerm);

    // Si está vacío, mostramos las primeras 6
    if (!term) return this.allCities().slice(0, 6);

    const safeTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${safeTerm}`, 'i');

    return this.allCities()
      .filter((c) => regex.test(this.normalizeText(c.nombre)))
      .slice(0, 6);
  });

  private normalizeText(text: string): string {
    return text
      ? text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      : '';
  }

  ngOnInit() {
    this.loading.set(true);
    this.geoService.getCities().subscribe({
      next: (data) => {
        this.allCities.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  // --- MÉTODOS CVA ---
  writeValue(value: string): void {
    const val = value || '';
    this.inputValue.set(val);
    this.lastValidValue = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // --- ACCIONES ---
  onInputFocus() {
    if (this.isDisabled) return;
    this.inputValue.set(''); // Limpia para escribir
    this.open.set(true);
  }

  selectOption(city: GeoCity) {
    this.updateValue(city.nombre);
    this.open.set(false);
  }

  private updateValue(value: string | null) {
    this.inputValue.set(value || '');
    this.onChange(value);
  }

  validateOnBlur() {
    this.onTouched();
    setTimeout(() => {
      const currentTerm = this.inputValue().toUpperCase();
      const match = this.allCities().find(c => c.nombre.toUpperCase() === currentTerm);

      if (match) {
        this.updateValue(match.nombre);
        this.lastValidValue = match.nombre;
      } else {
        
        if (this.restoreOnBlur) {
          this.inputValue.set(this.lastValidValue);
        } else {
          this.updateValue(null);
          this.inputValue.set('');
        }
      }
      this.open.set(false);
    }, 200);
  }

  // --- TECLADO ---
  onKeyDown(event: KeyboardEvent) {
    if (!this.open()) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') this.open.set(true);
      return;
    }
    const count = this.filteredCities().length;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex.update((i) => (i + 1) % count);
        this.scrollToSelected();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.update((i) => (i - 1 + count) % count);
        this.scrollToSelected();
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedIndex() >= 0 && count > 0)
          this.selectOption(this.filteredCities()[this.selectedIndex()]);
        else if (count > 0) this.selectOption(this.filteredCities()[0]);
        break;
      case 'Escape':
        this.open.set(false);
        break;
    }
  }

  scrollToSelected() {
    setTimeout(() => {
      const el = this.optionsList?.nativeElement.querySelector('.selected-nav');
      el?.scrollIntoView({ block: 'nearest' });
    }, 0);
  }

  highlightMatch(text: string): string {
    const term = this.normalizeText(this.inputValue());
    if (!term) return text;
    const regex = new RegExp(`(\\b${term})`, 'gi');
    return text.replace(regex, '<b>$1</b>');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.city-selector')) this.open.set(false);
  }
}
