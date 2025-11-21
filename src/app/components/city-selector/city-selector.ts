import { Component, computed, inject, input, output, signal, Signal } from '@angular/core';
import { CityFilterService } from '../../services/city-filter-service';

@Component({
  selector: 'app-city-selector',
  imports: [],
  templateUrl: './city-selector.html',
  styleUrl: './city-selector.css',
})
export class CitySelector {
  private cityFilter = inject(CityFilterService);

  /*
  readonly =>  evita que se pueda reasignar la propiedad entera
  CITIES: readonly string[] =>  CITIES es un array de strings que no se puede mutar a nivel de tipo
  as const => no permite cambios ni en longitud ni en valores
  */
  public readonly CITIES: readonly string[] = [
    'MAR DEL PLATA',
    'MIRAMAR',
    'NECOCHEA',
    'BALCARCE',
    'SANTA CLARA',
    'PINAMAR'
  ] as const;
  
  //signal que reactivo que muestra la ciudad actual
  currentCity = signal(this.cityFilter.getCity());

  //ciudades no seleccionadas, reacciona al signal
  otherCities = computed( () => 
    this.CITIES.filter(c => c !== this.currentCity())
  );

  // metodo para cambiar la ciudad
  onChange(newCity: string) {
    this.currentCity.set(newCity); //actualizo señal local
    this.cityFilter.setCity(newCity); //actualizo el servicio
  }
}
