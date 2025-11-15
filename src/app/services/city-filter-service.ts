import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CityFilterService {
  // Le colocamos por defecto MAR DEL PLATA, para que apenas abramos la web me muestre
  //solo emprendimientos de MAR DEL PLATA, y no todos los del back

  private citySignal = signal<string>('MAR DEL PLATA');

  public city = this.citySignal.asReadonly();

  setCity(city: string) {
    this.citySignal.set(city.toLocaleUpperCase());
  }

  getCity(): string {
    return this.citySignal();
  }
}

/* para usar la ciudad seleccionada como dato,
private cityFilter = inject(cityFilterService)
...
const city = this.cityFilter.city();
...
*/