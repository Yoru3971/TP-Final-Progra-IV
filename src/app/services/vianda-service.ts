import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViandaResponse } from '../model/vianda-response.model';
import { AuthService, UserRole } from './auth-service';
import { ViandaCreate } from '../model/vianda-create.model';

@Injectable({
  providedIn: 'root',
})
export class ViandaService {
  private apiUrl = 'http://localhost:8080/api/public/viandas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private baseUrls = {
    PUBLIC: 'http://localhost:8080/api/public/viandas',
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
        return this.baseUrls.PUBLIC;
    }
  }

  //Crear vianda (DUENO)
  createVianda(formData: FormData) {
    if (this.authService.currentUserRole() !== 'DUENO') {
      throw new Error('Solo los dueños pueden crear viandas');
    }

    return this.http.post<ViandaCreate>(this.baseUrls.DUENO, formData);
  }

  //Actualizar vianda (DUENO)

  //Actualizar imagen vianda (DUENO)

  //Eliminar vianda (DUENO)

  //Implementado en emprendimientoService / card
  //REVISAR Por ahora va asi, mas adelante evaluar si hace falta usar signals para cuando hagamos POST/PUT/DELETE
  getViandas() {
    return this.http.get<ViandaResponse[]>(this.apiUrl);
  }

  getViandaById(id: number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ViandaResponse>(url);
  }

  getViandasByEmprendimientoId(emprendimientoId: number) {
    const url = `${this.apiUrl}/idEmprendimiento/${emprendimientoId}`;
    return this.http.get<ViandaResponse[]>(url);
  }
}
