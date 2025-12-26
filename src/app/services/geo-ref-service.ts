import { HttpClient } from '@angular/common/http';
import { HtmlParser } from '@angular/compiler';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { GeoCity } from '../model/geo-city.model';

@Injectable({
  providedIn: 'root'
})
export class GeoRefService {
  private http = inject(HttpClient);

  private API_URL = 'https://apis.datos.gob.ar/georef/api/localidades-censales?max=5000&campos=nombre,provincia.nombre';

  getCities() {
    return this.http.get<any>(this.API_URL).pipe(
      map(response => {
        const cities: GeoCity[] = response.localidades_censales.map((l: any) => ({
          nombre: l.nombre,
          provincia: l.provincia.nombre,
          fullName: `${l.nombre} (${l.provincia.nombre})`
        }));

        return cities.sort((a, b) => a.nombre.localeCompare(b.nombre));
      })
    );
  }
}
