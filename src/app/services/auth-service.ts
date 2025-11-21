import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { UsuarioLogin } from '../model/usuario-login.model';
import { LoginResponse } from '../model/login-response.model';
import { UsuarioResponse } from '../model/usuario-response.model';
import { UsuarioRegistro } from '../model/usuario-registro.model';

export type UserRole = 'ADMIN' | 'DUENO' | 'CLIENTE' | 'INVITADO';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private TOKEN_KEY = 'authToken';

  public currentUserRole = signal<UserRole>(this.getRolFromToken());
  public usuarioId = signal<number | null>(this.getUsuarioIdFromStorage());

  private apiUrlLogin = 'http://localhost:8080/api/public/login';
  private apiUrlRegister = 'http://localhost:8080/api/public/register';

  constructor(private http: HttpClient) {
    console.log('AuthService inicializado. Rol actual', this.currentUserRole());
  }

  // leo el TOKEN actual y extraigo el rol (si no hay TOKEN, el rol es invitado)
  private getRolFromToken(): UserRole {
    const tokenLocal = localStorage.getItem(this.TOKEN_KEY);
    const tokenSession = sessionStorage.getItem(this.TOKEN_KEY);

    if (!tokenLocal && !tokenSession) {
      return 'INVITADO';
    }

    if (tokenLocal) {
      return this.decodeRolFrom(tokenLocal);
    } else {
      return this.decodeRolFrom(tokenSession!);
    }
  }

  private getUsuarioIdFromStorage(): number | null {
    const id = localStorage.getItem('usuarioID') || sessionStorage.getItem('usuarioID');
    return id ? Number(id) : null;
  }

  register(usuario: UsuarioRegistro) {
    return this.http.post<UsuarioResponse>(this.apiUrlRegister, usuario);
  }

  login(usuario: UsuarioLogin) {
    return this.http.post<LoginResponse>(this.apiUrlLogin, usuario);
  }

  // Si el usuario marca "Recordarme", se guarda el token en LocalStorage.
  //   Caso contrario, se guarda en SessionStorage
  public handleLoginSuccess(token: string, usuarioID: number, recordarme: boolean): void {
    if (recordarme) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem('usuarioID', usuarioID.toString());
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
      sessionStorage.setItem('usuarioID', usuarioID.toString());
    }

    this.currentUserRole.set(this.decodeRolFrom(token));
    this.usuarioId.set(usuarioID);

    console.log('Login exitoso. Rol:', this.currentUserRole(), 'UsuarioID:', this.usuarioId());
  }

  // Cierre de sesion y elimina la persistencia del token
  public handleLogout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);

    localStorage.removeItem('usuarioID');
    sessionStorage.removeItem('usuarioID');

    this.currentUserRole.set('INVITADO');
    console.log('Logout exitoso. Rol:', this.currentUserRole());
  }

  private decodeRolFrom(token: string): UserRole {
    try {
      const payloadBase64Url = token.split('.')[1];
      const payloadJson = this.decodeBase64Url(payloadBase64Url);
      const payload = JSON.parse(payloadJson);

      const rawRole: string = payload.role; // <-- AQUÍ

      if (!rawRole) {
        return 'CLIENTE'; // logueado sin rol -> cliente por defecto
      }

      // rawRole llega como "ROLE_DUENO"
      const cleanRole = rawRole.replace('ROLE_', '');

      const upperRole = cleanRole.toUpperCase();

      if (upperRole === 'ADMIN') return 'ADMIN';
      if (upperRole === 'DUENO') return 'DUENO';
      if (upperRole === 'CLIENTE') return 'CLIENTE';

      return 'CLIENTE';
    } catch (e) {
      console.error('Error al decodificar el token, volviendo a INVITADO', e);
      this.handleLogout();
      return 'INVITADO';
    }
  }

  // Decodificador para decodificar Base64Url (el formato que tiene JWT)
  private decodeBase64Url(base64Url: string): string {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    if (padding) {
      base64 += '===='.substring(padding);
    }
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }
}
