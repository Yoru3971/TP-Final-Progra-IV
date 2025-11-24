import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CityFilterService {
  // Por defecto MAR DEL PLATA, para que apenas abramos la web solo muestre esos y no todos los del back

  private citySignal = signal<string>('MAR DEL PLATA');

  public city = this.citySignal.asReadonly();

  setCity(city: string) {
    this.citySignal.set(city.toLocaleUpperCase());
  }

  getCity(): string {
    return this.citySignal();
  }
}
