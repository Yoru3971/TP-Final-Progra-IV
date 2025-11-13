import { Injectable, signal } from '@angular/core';

export type UserRole = 'ADMIN' | 'DUENO' | 'CLIENTE' | 'INVITADO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'authToken';

  // Signal con rol del usuario
  public currentUserRole = signal<UserRole>(this.getRolFromToken())

  constructor() {
    console.log('AuthService inicializado. Rol actual', this.currentUserRole());
  }

  // leo el TOKEN actual en el LocalStorage y extraigo el rol
  // (si no hay TOKEN, el rol es invitado)
  private getRolFromToken(): UserRole {
    const token = localStorage.getItem(this.TOKEN_KEY);

    // caso 1: no hay token
    if(!token) {
      return 'INVITADO';
    }

    // caso 2: existe un token, entonces lo decodifico
    return this.decodeRolFrom(token);
  }

  /* manejo la persistencia del TOKEN de la sesion.
   * lo almaceno en el LocalStorage y actualizo el rol
  */
 public handleLoginSuccess(token: string): void {
  // Guardo el token en el LocalStorage
  localStorage.setItem(this.TOKEN_KEY, token);
  this.currentUserRole.set(this.decodeRolFrom(token));
  console.log('Login exitoso. Nuevo Rol', this.currentUserRole());
  
 }

 // Cierre de sesion y elimina la persistencia del token
 public handleLogout(): void {
  // Elimino el token del LocalStorage
  localStorage.removeItem(this.TOKEN_KEY);
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
