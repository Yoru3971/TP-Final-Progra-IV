import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioResponse } from '../model/usuario-response.model';
import { Observable } from 'rxjs';
import { ChangePasswordRequest } from '../model/change-password-request.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  getPerfilUsuario(): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/me`);
  }

  cambiarPassword(body: ChangePasswordRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/changePassword/me`, body);
  }

  eliminarCuenta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
