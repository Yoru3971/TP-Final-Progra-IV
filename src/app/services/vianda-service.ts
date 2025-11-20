import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ViandaResponse } from '../model/vianda-response.model';
import { FiltrosViandas } from '../model/filtros-viandas.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViandaService {
  private apiUrlPublic = 'http://localhost:8080/api/public/viandas';
  private apiUrlCliente = 'http://localhost:8080/api/cliente/viandas';
  private apiUrlDueno = 'http://localhost:8080/api/dueno/viandas';

  constructor(private http: HttpClient) {}

  //REVISAR Por ahora va asi, mas adelante evaluar si hace falta usar signals para cuando hagamos POST/PUT/DELETE
  getViandas() {
    return this.http.get<ViandaResponse[]>(this.apiUrlPublic);
  }

  getViandaById(id: number) {
    const url = `${this.apiUrlPublic}/${id}`;
    return this.http.get<ViandaResponse>(url);
  }

  getViandasByEmprendimientoId(emprendimientoId: number) {
  const url = `${this.apiUrlPublic}/idEmprendimiento/${emprendimientoId}`;
  return this.http.get<ViandaResponse[]>(url);
  }


  // -----------------  Métodos de Emprendimiento Page  -----------------

  // El cliente solo ve las viandas disponibles (+ filtros)
  getViandasCliente(idEmprendimiento: number, filtros?: FiltrosViandas): Observable<ViandaResponse[]> {
    const params = this.construirParams(filtros);
    
    return this.http.get<ViandaResponse[]>(
      `${this.apiUrlCliente}/idEmprendimiento/${idEmprendimiento}`, 
      { params }
    );
  }

  // El dueño ve todas sus viandas (+ filtros)
  getViandasDueno(idEmprendimiento: number, filtros?: FiltrosViandas): Observable<ViandaResponse[]> {
    const params = this.construirParams(filtros);

    return this.http.get<ViandaResponse[]>(
      `${this.apiUrlDueno}/idEmprendimiento/${idEmprendimiento}`, 
      { params }
    );
  }

  //  Limpia basura del filtro y lo transforma a parámetros HTTP
  private construirParams(filtros?: FiltrosViandas): HttpParams {
    let params = new HttpParams();

    if (filtros) {
      if (filtros.nombreVianda) params = params.set('nombreVianda', filtros.nombreVianda);
      if (filtros.categoria) params = params.set('categoria', filtros.categoria);
      if (filtros.esVegano) params = params.set('esVegano', true);
      if (filtros.esVegetariano) params = params.set('esVegetariano', true);
      if (filtros.esSinTacc) params = params.set('esSinTacc', true);
      if (filtros.precioMin != null) params = params.set('precioMin', filtros.precioMin);
      if (filtros.precioMax != null) params = params.set('precioMax', filtros.precioMax);
      if (filtros.estaDisponible != null) params = params.set('estaDisponible', filtros.estaDisponible);
    }

    return params;
  }
}
