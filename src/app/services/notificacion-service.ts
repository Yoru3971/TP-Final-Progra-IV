import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Notificacion } from '../model/notificacion.model';
import { catchError, map, of } from 'rxjs';
import { AuthService, UserRole } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  public allNotificaciones = signal<Notificacion[]>([]);

  // señal ordenada DESC por fecha (más nuevas primero)
  public notificacionesOrdenadas = computed<Notificacion[]>(() => {
    const list = this.allNotificaciones();

    return [...list].sort((a, b) => {
      const fa = new Date(a.fechaEnviado).getTime();
      const fb = new Date(b.fechaEnviado).getTime();
      return fb - fa;
    });
  });

  //filtros por fecha
  public filtroDesde = signal<string | null>(null);
  public filtroHasta = signal<string | null>(null);

  private baseUrls = {
    DUENO: 'http://localhost:8080/api/dueno/notificaciones',
    CLIENTE: 'http://localhost:8080/api/cliente/notificaciones',
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getApiUrl(): string {
    const rol: UserRole = this.authService.currentUserRole();
    return rol === 'DUENO' ? this.baseUrls.DUENO : this.baseUrls.CLIENTE;
  }

  fetchNotificaciones() {
    const url = this.getApiUrl();
    this.http
      .get<Notificacion[]>(url)
      .pipe(
        catchError((err) => {
          if (err.status !== 404) {
            console.error('Error al cargar notificaciones:', err);
          }
          return of([]);
        })
      )
      .subscribe((result) => {
        setTimeout(() => this.allNotificaciones.set(result));
      });
  }

  fetchNotificacionesUltimaSemana() {
    const url = this.getApiUrl();

    const { desde, hasta } = this.getRangoUltimaSemana();
    const finalUrl = `${url}/entre-fechas?desde=${desde}&hasta=${hasta}`;

    this.http
      .get<Notificacion[]>(finalUrl)
      .pipe(
        catchError((err) => {
          if (err.status !== 404) {
            console.error('Error cargando notificaciones:', err);
          }
          return of([]);
        })
      )
      .subscribe((list) => {
        setTimeout(() => this.allNotificaciones.set(list));
      });
  }

  private getRangoUltimaSemana() {
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);

    return {
      desde: hace7Dias.toISOString().split('T')[0],
      hasta: hoy.toISOString().split('T')[0],
    };
  }

  //lista filtrada por fecha + ordenada
  public notificacionesFiltradas = computed(() => {
    const lista = this.allNotificaciones();
    const desde = this.filtroDesde();
    const hasta = this.filtroHasta();

    return lista
      .filter(noti => {
        let ok = true;

        if (desde)
          ok = ok && new Date(noti.fechaEnviado) >= new Date(desde);

        if (hasta)
          ok = ok && new Date(noti.fechaEnviado) <= new Date(hasta);

        return ok;
      })
      .sort((a, b) =>
        new Date(b.fechaEnviado).getTime() -
        new Date(a.fechaEnviado).getTime()
      );
  });
}
