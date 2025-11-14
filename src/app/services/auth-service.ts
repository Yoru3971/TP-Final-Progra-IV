import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { UsuarioLogin } from '../model/usuario-login.model';
import { LoginResponse } from '../model/login-response.model';

export type UserRole = 'ADMIN' | 'DUENO' | 'CLIENTE' | 'INVITADO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private TOKEN_KEY = 'authToken';

  // Signal con rol del usuario
  public currentUserRole = signal<UserRole>(this.getRolFromToken())
  private apiUrlLogin = 'http://localhost:8080/api/public/login';

  constructor(private http: HttpClient) {
    console.log('AuthService inicializado. Rol actual', this.currentUserRole());
  }

  // leo el TOKEN actual y extraigo el rol
  // (si no hay TOKEN, el rol es invitado)
  private getRolFromToken(): UserRole {
    const tokenLocal = localStorage.getItem(this.TOKEN_KEY);
    const tokenSession = sessionStorage.getItem(this.TOKEN_KEY);

    // caso 1: no hay token
    if(!tokenLocal && !tokenSession) {
      return 'INVITADO';
    }

    // caso 2: existe un token, entonces lo decodifico
    if(tokenLocal){
      return this.decodeRolFrom(tokenLocal);
    }else{
      return this.decodeRolFrom(tokenSession!);
    }
    
  }

  login(usuario: UsuarioLogin) {
        return this.http.post<LoginResponse>(this.apiUrlLogin, usuario);
  }

  // Si el usuario marca "Recordarme", se guarda el token en LocalStorage.
  //   Caso contrario, se guarda en SessionStorage
  public handleLoginSuccess(token: string, recordarme: boolean): void {

    if (recordarme){
      localStorage.setItem(this.TOKEN_KEY, token);
    }else{
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
    
    this.currentUserRole.set(this.decodeRolFrom(token));
    console.log('Login exitoso. Nuevo Rol', this.currentUserRole());
    
  }

  // Cierre de sesion y elimina la persistencia del token
  public handleLogout(): void {
  
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    
    this.currentUserRole.set('INVITADO');
    console.log('Logout exitoso. Rol:', this.currentUserRole());
  }

  private decodeRolFrom(token: string): UserRole {
    try{
      // en el JWT es header.payload.signature
      const payloadBase64Url = token.split('.')[1];
      const payloadJson = this.decodeBase64Url(payloadBase64Url);
      const payload = JSON.parse(payloadJson);

      const roleString = payload.role as string; // Claim: 'rol'

      ///REVISAR
      if (!roleString) {
        // --> logueado sin rol especifico, CLIENTE por defecto
        // si algo falla en el back y no tengo el rol, le doy los minimos privilegios
        return 'CLIENTE';
      }

      const upperRole = roleString.toUpperCase();

      //Mapeo del rol
      if (upperRole === 'ADMIN') {
        return 'ADMIN';
      }

      if (upperRole === 'DUENO') {
        return 'DUENO';
      }

      if (upperRole === 'CLIENTE') {
        return 'CLIENTE';
      }

      // Si el rol es desconocido, se asumo es cliente logueado
      return 'CLIENTE';

    } catch (e) {
      console.error("Error al decodificar el token, asumiendo invitado", e);
      this.handleLogout();
      return 'INVITADO';
    }
  }

  // Decodificador para decodificar Base64Url (el formato que tiene JWT)
  private decodeBase64Url(base64Url: string): string {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length  % 4;
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

}
