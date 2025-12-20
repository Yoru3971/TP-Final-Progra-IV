import { Component, computed, ElementRef, HostListener, inject, OnInit, signal, ViewChild, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Necesario para pipes si usas alguno, o innerHTML
import { CityFilterService } from '../../../services/city-filter-service';
import { GeoRefService } from '../../../services/geo-ref-service';
import { GeoCity } from '../../../model/geo-city.model';

@Component({
  selector: 'app-city-selector',
  imports: [FormsModule, CommonModule],
  templateUrl: './city-selector.html',
  styleUrl: './city-selector.css',
})
export class CitySelector implements OnInit {
  private cityFilter = inject(CityFilterService);
  private geoService = inject(GeoRefService);
  
  //scroll automático con teclado
  @ViewChild('optionsList') optionsList!: ElementRef;

  allCities = signal<GeoCity[]>([]);
  inputValue = signal<string>(this.cityFilter.getCity());
  open = signal(false);
  loading = signal(false);
  
  //para navegación con flechas
  selectedIndex = signal(-1);

  filteredCities = computed(() => {
    const rawTerm = this.inputValue();

    const term = this.normalizeText(rawTerm);
    
    if (!term) return this.allCities().slice(0, 6);

    const safeTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
    const regex = new RegExp(`\\b${safeTerm}`, 'i'); 

    const cities = this.allCities();

    return cities
      .filter(c => {
        const normalizedName = this.normalizeText(c.nombre);
        return regex.test(normalizedName);
      })
      .slice(0, 6);
  });

  //helper para quitar acentos
  private normalizeText(text: string): string {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  ngOnInit() {
    this.loading.set(true);
    this.geoService.getCities().subscribe({
      next: (data) => {
        this.allCities.set(data);
        this.loading.set(false);
        this.inputValue.set(this.cityFilter.getCity());
      },
      error: () => this.loading.set(false)
    });
  }

  //reseteamos el índice de flechas cuando cambia el filtro
  constructor() {
    effect(() => {
      this.filteredCities(); 
      this.selectedIndex.set(-1);
    });
  }

  // --- ACCIONES ---

  selectOption(city: GeoCity) {
    this.updateGlobalState(city.nombre);
    this.open.set(false);
  }

  private updateGlobalState(cityName: string) {
    const upperName = cityName.toUpperCase();
    this.inputValue.set(upperName);
    this.cityFilter.setCity(upperName);
  }

  onInputFocus() {
    //borramos visualmente el texto para que el usuario escriba cómodo
    this.inputValue.set(''); 
    //se abre el desplegable
    this.open.set(true);
  }

  validateOnBlur() {
    setTimeout(() => {
      const currentTerm = this.inputValue().toUpperCase();
      
      const match = this.allCities().find(c => 
        c.nombre.toUpperCase() === currentTerm
      );

      if (match) {
        //si es válida, guardamos y actualizamos todo
        this.updateGlobalState(match.nombre);
      } else {
        //si está vacío o escribió basura
        // Recuperamos el valor "real" que tiene el servicio (ej: MAR DEL PLATA)
        const lastValid = this.cityFilter.getCity();
        this.inputValue.set(lastValid);
      }
      this.open.set(false);
    }, 200);
  }

  // --- NAVEGACIÓN POR TECLADO ---
  onKeyDown(event: KeyboardEvent) {
    if (!this.open()) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') this.open.set(true);
      return;
    }

    const optionsCount = this.filteredCities().length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault(); //para evitar que se mueva el cursor del input
        this.selectedIndex.update(i => (i + 1) % optionsCount);
        this.scrollToSelected();
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.update(i => (i - 1 + optionsCount) % optionsCount);
        this.scrollToSelected();
        break;

      case 'Enter':
        event.preventDefault();
        if (this.selectedIndex() >= 0 && optionsCount > 0) {
          const selectedCity = this.filteredCities()[this.selectedIndex()];
          this.selectOption(selectedCity);
        } else if (optionsCount > 0) {
          //si le da a enter sin seleccionar nada con flechas, selecciona el primero
          this.selectOption(this.filteredCities()[0]);
        }
        break;
      
      case 'Escape':
        this.open.set(false);
        break;
    }
  }

  //mantener el scroll visible
  scrollToSelected() {
    setTimeout(() => {
      if (this.optionsList) {
        const active = this.optionsList.nativeElement.querySelector('.selected-nav');
        if (active) {
          active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
      }
    }, 0);
  }

  // --- Resaltar texto ---
  highlightMatch(text: string): string {
    const term = this.normalizeText(this.inputValue());
    if (!term) return text;

    // Regex para encontrar la palabra que empieza con el termino, manteniendo mayusculas originales
    const regex = new RegExp(`(\\b${term})`, 'gi');
    return text.replace(regex, '<b>$1</b>');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.city-selector')) {
      this.open.set(false);
    }
  }
}