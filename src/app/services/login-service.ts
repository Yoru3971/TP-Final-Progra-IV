import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioLogin } from '../model/usuario-login.model';
import { LoginResponse } from '../model/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {     //  MOVER se va todo al auth-service

  private apiUrl = 'http://localhost:8080/api/public/login';

  constructor(private http: HttpClient) {}

  login(usuario: UsuarioLogin) {
      return this.http.post<LoginResponse>(this.apiUrl, usuario);
    }

}
