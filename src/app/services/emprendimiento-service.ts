import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmprendimientoResponse } from '../model/emprendimiento-response.model';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmprendimientoService {
  private apiUrl = 'http://localhost:8080/api/public/emprendimientos';

  // Signal para almacenar el listado de emprendimientos
  public emprendimientos = signal<EmprendimientoResponse[]>([]);

  constructor(private http: HttpClient) {}

  // Obtener todos y actualizar signal
  fetchEmprendimientos() {
    this.http.get<EmprendimientoResponse[]>(this.apiUrl)
      .pipe(
        catchError(err => {
          console.error('Error al cargar emprendimientos', err);
          return of([]);
        })
      )
      .subscribe(this.emprendimientos);
  }

  // Crear un nuevo emprendimiento
  createEmprendimiento(formData: FormData) {
    return this.http.post<EmprendimientoResponse>(this.apiUrl, formData)
      .pipe(
        tap(nuevo => {
          // actualizar signal agregando el nuevo emprendimiento
          this.emprendimientos.update(list => [...list, nuevo]);
        })
      );
  }

  // Obtener uno por id
  getEmprendimientoById(id: number) {
    return this.http.get<EmprendimientoResponse>(`${this.apiUrl}/${id}`);
  }

  // Actualizar un emprendimiento
  updateEmprendimiento(id: number, formData: FormData) {
    return this.http.put<EmprendimientoResponse>(`${this.apiUrl}/${id}`, formData)
      .pipe(
        tap(actualizado => {
          this.emprendimientos.update(list =>
            list.map(e => e.id === id ? actualizado : e)
          );
        })
      );
  }

  // Eliminar un emprendimiento
  deleteEmprendimiento(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.emprendimientos.update(list => list.filter(e => e.id !== id));
        })
      );
  }
}
