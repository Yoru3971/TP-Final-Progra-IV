import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmprendimientoResponse } from '../model/emprendimiento-response.model';
import { catchError, of, tap } from 'rxjs';
import { AuthService, UserRole } from './auth-service';

@Injectable({ providedIn: 'root' })
export class EmprendimientoService {

  //signal que almacena la lista de emprendimientos visibles en la app
  public emprendimientos = signal<EmprendimientoResponse[]>([]);

  //url según el rol del usuario
  private baseUrls = {
    PUBLIC: 'http://localhost:8080/api/public/emprendimientos',
    DUENO: 'http://localhost:8080/api/dueno/emprendimientos'
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  //devuelvo la url correspondiente según el rol del usuario
  private getApiUrl(): string {
    const rol: UserRole = this.authService.currentUserRole();
    return rol === 'DUENO' ? this.baseUrls.DUENO : this.baseUrls.PUBLIC;
  }
  
  //función para cargar todos los emprendimientos 
  //obtiene los emprendimientos desde el backend y lo guarda en un signal
  fetchEmprendimientos() {
    const url = this.getApiUrl();
    this.http.get<EmprendimientoResponse[]>(url)
      .pipe(
        catchError(err => {
          console.error('Error al cargar emprendimientos', err);
          return of([]);
        })
      )
      .subscribe(result => {
        // evita NG0100
        setTimeout(() => this.emprendimientos.set(result));
      });
  }

  //metodos del dueño, CRUD
  //crear un emprendimiento
  createEmprendimiento(formData: FormData) {
    if (this.authService.currentUserRole() !== 'DUENO') {
      throw new Error('Solo dueños pueden crear emprendimientos');
    }
    return this.http.post<EmprendimientoResponse>(this.baseUrls.DUENO, formData)
      .pipe(
        tap(nuevo => this.emprendimientos.update(list => [...list, nuevo]))
      );
  }

  //actualizar un emprendimiento existente propio
  updateEmprendimiento(id: number, formData: FormData) {
    if (this.authService.currentUserRole() !== 'DUENO') {
      throw new Error('Solo dueños pueden actualizar emprendimientos');
    }
    return this.http.put<EmprendimientoResponse>(`${this.baseUrls.DUENO}/id/${id}`, formData)
      .pipe(
        tap(actualizado => this.emprendimientos.update(list =>
          list.map(e => e.id === id ? actualizado : e)
        ))
      );
  }
  
  //borrar un emprendimiento propio
  deleteEmprendimiento(id: number) {
    if (this.authService.currentUserRole() !== 'DUENO') {
      throw new Error('Solo dueños pueden eliminar emprendimientos');
    }
    return this.http.delete<void>(`${this.baseUrls.DUENO}/id/${id}`)
      .pipe(
        tap(() => this.emprendimientos.update(list => list.filter(e => e.id !== id)))
      );
  }

  // ---------------------- Filtros ----------------------
  //filtro por nombre
  getEmprendimientosByNombre(nombre: string) {
    const rol: UserRole = this.authService.currentUserRole();
    const url = rol === 'DUENO'
      ? `${this.baseUrls.DUENO}/nombre/${nombre}`
      : `${this.baseUrls.PUBLIC}/nombre/${nombre}`;
    return this.http.get<EmprendimientoResponse[]>(url)
      .pipe(catchError(() => of([])));
  }

  //filtro por ciudad
  getEmprendimientosByCiudad(ciudad: string) {
    const rol: UserRole = this.authService.currentUserRole();
    const url = rol === 'DUENO'
      ? `${this.baseUrls.DUENO}/ciudad/${ciudad}`
      : `${this.baseUrls.PUBLIC}/ciudad/${ciudad}`;
    return this.http.get<EmprendimientoResponse[]>(url)
      .pipe(catchError(() => of([])));
  }

  //obtener un emprendimiento por su id
  getEmprendimientoById(id: number) {
    return this.http.get<EmprendimientoResponse>(`${this.getApiUrl()}/id/${id}`);
  }
}


