import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = 'http://localhost:8080/api/public/register';

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: Usuario) {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }
}
