import { Component, inject, OnInit } from '@angular/core';
import { NotificacionService } from '../../services/notificacion-service';
import { NotificacionSingleCardComponent } from '../notificacion-single-card/notificacion-single-card';
import { DateRangePickerComponent } from '../date-range-picker/date-range-picker'; 

@Component({
  selector: 'app-notificaciones-card',
  imports: [NotificacionSingleCardComponent, DateRangePickerComponent],
  templateUrl: './notificaciones-card.html',
  styleUrl: './notificaciones-card.css',
})
export class NotificacionesCard implements OnInit {
  private notiService = inject(NotificacionService);

  cargando = true;

  ngOnInit() {
    this.notiService.fetchNotificaciones();
    setTimeout(() => (this.cargando = false), 300);
  }

  get lista() {
    return this.notiService.notificacionesFiltradas();
  }

  onFechasSeleccionadas(fechas: { desde: Date; hasta: Date }) {
    // convertimos a ISO y seteamos en el service
    const desde = fechas.desde.toISOString().split('T')[0];
    const hasta = fechas.hasta.toISOString().split('T')[0];

    this.notiService.filtroDesde.set(desde);
    this.notiService.filtroHasta.set(hasta);
  }
}
