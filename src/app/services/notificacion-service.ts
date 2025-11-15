import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Notificacion } from '../model/notificacion.model';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private http = inject(HttpClient);

  //signal para almacenar notificaciones
  public notificaciones = signal<Notificacion[]>([]);

  getNotificacionesUltimaSemana() {
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);

    const desde = hace7Dias.toISOString().split('T')[0];
    const hasta = hoy.toISOString().split('T')[0];

    //REVISAR solo implementado para el dueño
    this.http.get<Notificacion[]>(`http://localhost:8080/api/dueno/notificaciones/entre-fechas?desde=${desde}&hasta=${hasta}`)
    .pipe(
      map(noti => noti.slice(0, 10)), //muestro maximo 10
      catchError(err => {
        console.error(err);
        return of([]);
      })
    )
    .subscribe(this.notificaciones);
  }
}
