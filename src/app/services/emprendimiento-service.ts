import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmprendimientoResponse } from '../model/emprendimiento-response.model';
import { catchError, of, tap } from 'rxjs';
import { AuthService, UserRole } from './auth-service';
import { CityFilterService } from './city-filter-service';

@Injectable({ providedIn: 'root' })
export class EmprendimientoService {
  private cityFilter = inject(CityFilterService);
  public allEmprendimientos = signal<EmprendimientoResponse[]>([]);

  //señal publica que siempre refleja los emprendimientos filtrados por ciudad
  public emprendimientos = computed(() => {
    const ciudadActual = (this.cityFilter.city() ?? '').toUpperCase();

    return this.allEmprendimientos().filter((e) => (e.ciudad ?? '').toUpperCase() === ciudadActual);
  });

  private baseUrls = {
    PUBLIC: 'http://localhost:8080/api/public/emprendimientos',
    DUENO: 'http://localhost:8080/api/dueno/emprendimientos',
    CLIENTE: 'http://localhost:8080/api/cliente/emprendimientos',
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

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

  //función para cargar todos los emprendimientos
  //obtiene los emprendimientos desde el backend y lo guarda en un signal
  fetchEmprendimientos() {
    const url = this.getApiUrl();
    this.http
      .get<EmprendimientoResponse[]>(url)
      .pipe(
        catchError((err) => {
          console.error('Error al cargar emprendimientos', err);
          return of([]);
        })
      )
      .subscribe((result) => {
        // evita NG0100
        setTimeout(() => this.allEmprendimientos.set(result));
      });
  }
  
  getEmprendimientoById(id: number) {
    const url = this.getApiUrl();
    return this.http.get<EmprendimientoResponse>(`${url}/id/${id}`);
  }

  //metodos del dueño, CRUD
  createEmprendimiento(formData: FormData) {
    if (this.authService.currentUserRole() !== 'DUENO') {
      throw new Error('Solo dueños pueden crear emprendimientos');
    }
    return this.http
      .post<EmprendimientoResponse>(this.baseUrls.DUENO, formData)
      .pipe(tap((nuevo) => this.allEmprendimientos.update((list) => [...list, nuevo])));
  }

  updateEmprendimiento(id: number, formData: FormData) {
    if (this.authService.currentUserRole() !== 'DUENO') {
      throw new Error('Solo dueños pueden actualizar emprendimientos');
    }
    return this.http
      .put<EmprendimientoResponse>(`${this.baseUrls.DUENO}/id/${id}`, formData)
      .pipe(
        tap((actualizado) =>
          this.allEmprendimientos.update((list) => list.map((e) => (e.id === id ? actualizado : e)))
        )
      );
  }

  //borrar un emprendimiento propio
  deleteEmprendimiento(id: number) {
    if (this.authService.currentUserRole() !== 'DUENO') {
      throw new Error('Solo dueños pueden eliminar emprendimientos');
    }
    return this.http
      .delete<void>(`${this.baseUrls.DUENO}/id/${id}`)
      .pipe(tap(() => this.allEmprendimientos.update((list) => list.filter((e) => e.id !== id))));
  }
}
