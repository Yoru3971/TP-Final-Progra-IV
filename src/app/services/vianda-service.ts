import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViandaResponse } from '../model/vianda-response.model';

@Injectable({
  providedIn: 'root'
})
export class ViandaService {
  private apiUrl = 'http://localhost:8080/api/public/viandas';

  constructor(private http: HttpClient) {}

  //REVISAR Por ahora va asi, mas adelante evaluar si hace falta usar signals para cuando hagamos POST/PUT/DELETE
  getViandas() {
    return this.http.get<ViandaResponse[]>(this.apiUrl);
  }

  getViandaById(id: number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ViandaResponse>(url);
  }

  getViandasByEmprendimientoId(emprendimientoId: number) {
    const url = `${this.apiUrl}/emprendimiento/${emprendimientoId}`;
    return this.http.get<ViandaResponse[]>(url);
  }
}
