import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { CityFilterService } from '../../../services/city-filter-service';

@Component({
  selector: 'app-city-selector',
  imports: [],
  templateUrl: './city-selector.html',
  styleUrl: './city-selector.css',
})
export class CitySelector {
  private cityFilter = inject(CityFilterService);

  // Temporal, eventualmente las vamos a levantar de una API
  public readonly CITIES: readonly string[] = [
    'MAR DEL PLATA',
    'MIRAMAR',
    'NECOCHEA',
    'BALCARCE',
    'SANTA CLARA',
    'PINAMAR',
  ] as const;

  // Signal reactivo con la ciudad actual
  currentCity = signal(this.cityFilter.getCity());

  // Ciudades no seleccionadas, reacciona al signal
  otherCities = computed(() => this.CITIES.filter((c) => c !== this.currentCity()));

  onChange(newCity: string) {
    this.currentCity.set(newCity);
    this.cityFilter.setCity(newCity);
  }

  open = false;

  onOptionSelect(city: string) {
    this.onChange(city);
    this.open = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.select-custom');
    if (!clickedInside) {
      this.open = false;
    }
  }
}
