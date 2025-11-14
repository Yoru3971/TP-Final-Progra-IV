import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioRegistro } from '../model/usuario-registro.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = 'http://localhost:8080/api/public/register';

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: UsuarioRegistro) {
    return this.http.post<UsuarioRegistro>(this.apiUrl, usuario);
  }
}
