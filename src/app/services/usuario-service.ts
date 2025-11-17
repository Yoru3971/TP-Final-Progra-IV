import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioResponse } from '../model/usuario-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  getPerfilUsuario(): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/me`);
  }
}
