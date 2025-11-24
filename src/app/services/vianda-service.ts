import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ViandaResponse } from '../model/vianda-response.model';
import { AuthService, UserRole } from './auth-service';
import { ViandaCreate } from '../model/vianda-create.model';
import { FiltrosViandas } from '../model/filtros-viandas.model';
import { Observable } from 'rxjs';
import { ViandaUpdate } from '../model/vianda-update.model';
import { ViandaDeleteResponse } from '../model/vianda-delete-response.model';

@Injectable({
  providedIn: 'root',
})
export class ViandaService {
  private apiUrl = 'http://localhost:8080/api/public/viandas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private baseUrls = {
    INVITADO: 'http://localhost:8080/api/public/viandas',
    DUENO: 'http://localhost:8080/api/dueno/viandas',
    CLIENTE: 'http://localhost:8080/api/cliente/viandas',
  };

  // Selecciona endpoint según el rol
  private getApiUrl(): string {
    const rol: UserRole = this.authService.currentUserRole();

    switch (rol) {
      case 'DUENO':
        return this.baseUrls.DUENO;

      case 'CLIENTE':
        return this.baseUrls.CLIENTE;

      default:
        return this.baseUrls.INVITADO;
    }
  }

  // CRUD

  createVianda(formData: FormData) {
    if (this.authService.currentUserRole() !== 'DUENO') {
      throw new Error('Solo los dueños pueden crear viandas');
    }

    return this.http.post<ViandaCreate>(this.baseUrls.DUENO, formData);
  }

  updateVianda(id: number, dto: ViandaUpdate): Observable<any> {
    if (this.authService.currentUserRole() !== 'DUENO') {
      throw new Error('Solo los dueños pueden actualizar viandas');
    }

    const url = `${this.baseUrls.DUENO}/id/${id}`;
    return this.http.put<any>(url, dto);
  }

  updateImagenVianda(id: number, file: File): Observable<ViandaResponse> {
    if (this.authService.currentUserRole() !== 'DUENO') {
      throw new Error('Solo los dueños pueden actualizar imágenes');
    }

    const url = `${this.baseUrls.DUENO}/id/${id}/imagen`;

    const formData = new FormData();
    formData.append('image', file);

    return this.http.put<ViandaResponse>(url, formData);
  }

  deleteVianda(id: number): Observable<ViandaDeleteResponse> {
    if (this.authService.currentUserRole() !== 'DUENO') {
      throw new Error('Solo los dueños pueden eliminar viandas');
    }

    const url = `${this.baseUrls.DUENO}/id/${id}`;

    return this.http.delete<ViandaDeleteResponse>(url);
  }

  getViandas() {
    return this.http.get<ViandaResponse[]>(this.apiUrl);
  }

  getViandaById(id: number) {
    const url = `${this.getApiUrl()}/id/${id}`;
    return this.http.get<ViandaResponse>(url);
  }

  getViandasByEmprendimientoId(emprendimientoId: number) {
    const url = `${this.apiUrl}/idEmprendimiento/${emprendimientoId}`;
    return this.http.get<ViandaResponse[]>(url);
  }

  // -----------------  Métodos de Emprendimiento Page  -----------------

  // El invitado solo ve las viandas disponibles (+ filtros)
  getViandasPublico(
    idEmprendimiento: number,
    filtros?: FiltrosViandas
  ): Observable<ViandaResponse[]> {
    const params = this.construirParams(filtros);

    return this.http.get<ViandaResponse[]>(
      `${this.baseUrls.INVITADO}/idEmprendimiento/${idEmprendimiento}`,
      { params }
    );
  }

  // El cliente ve lo mismo que el invitado (pero el  back lo diferencia)
  getViandasCliente(
    idEmprendimiento: number,
    filtros?: FiltrosViandas
  ): Observable<ViandaResponse[]> {
    const params = this.construirParams(filtros);

    return this.http.get<ViandaResponse[]>(
      `${this.baseUrls.CLIENTE}/idEmprendimiento/${idEmprendimiento}`,
      { params }
    );
  }

  // El dueño ve todas sus viandas (+ filtros)
  getViandasDueno(
    idEmprendimiento: number,
    filtros?: FiltrosViandas
  ): Observable<ViandaResponse[]> {
    const params = this.construirParams(filtros);

    return this.http.get<ViandaResponse[]>(
      `${this.baseUrls.DUENO}/idEmprendimiento/${idEmprendimiento}`,
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
      if (filtros.estaDisponible != null)
        params = params.set('estaDisponible', filtros.estaDisponible);
    }

    return params;
  }
}
