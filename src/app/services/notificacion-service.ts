import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Notificacion } from '../model/notificacion.model';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  //signal para almacenar notificaciones
  public notificaciones = signal<Notificacion[]>([]);

  getNotificacionesUltimaSemana() {
    const url = this.getUrlNotificaciones();
    if (!url) {
      console.warn(
        'No se pudo construir la URL de notificaciones. Rol actual:',
        this.auth.currentUserRole()
      );
      this.notificaciones.set([]);
      return;
    }

    const { desde, hasta } = this.getRangoUltimaSemana();

    this.http
      .get<Notificacion[]>(`${url}?desde=${desde}&hasta=${hasta}`)
      .pipe(
        map((noti) => noti.slice(0, 10)),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe(this.notificaciones);
  }

  // devuelve el rango de fechas
  private getRangoUltimaSemana() {
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);

    return {
      desde: hace7Dias.toISOString().split('T')[0],
      hasta: hoy.toISOString().split('T')[0],
    };
  }

  //devuelve URL segun el rol
  private getUrlNotificaciones(): string | null {
    const rol = this.auth.currentUserRole();

    switch (rol) {
      case 'DUENO':
        return 'http://localhost:8080/api/dueno/notificaciones/entre-fechas';
      case 'CLIENTE':
        return 'http://localhost:8080/api/cliente/notificaciones/entre-fechas';
      default:
        console.warn('Rol sin permisos para obtener notificaciones:', rol);
        return null;
    }
  }
}
