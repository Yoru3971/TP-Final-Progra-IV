import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificacionService } from '../../../services/notificacion-service';
import { NotificacionSingleCardComponent } from '../notificacion-single-card/notificacion-single-card';
import { DateRangePickerComponent } from '../../utils/date-range-picker/date-range-picker'; 

type EstadoFiltro = 'TODAS' | 'NO_LEIDAS' | 'LEIDAS';

@Component({
  selector: 'app-notificaciones-card',
  imports: [NotificacionSingleCardComponent, DateRangePickerComponent],
  templateUrl: './notificaciones-card.html',
  styleUrl: './notificaciones-card.css',
})
export class NotificacionesCard implements OnInit {
  public notiService = inject(NotificacionService);

  filtroEstado = signal<EstadoFiltro>('TODAS');

  cargando = true;

  ngOnInit() {
    this.notiService.fetchNotificaciones();
    setTimeout(() => (this.cargando = false), 300);
  }

  setFiltro(estado: EstadoFiltro) {
    this.filtroEstado.set(estado);
  }

  get listaVisual() {
    let lista = this.notiService.notificacionesFiltradas();
    
    const estado = this.filtroEstado();
    
    if (estado === 'NO_LEIDAS') {
      lista = lista.filter(n => !n.leida);
    } else if (estado === 'LEIDAS') {
      lista = lista.filter(n => n.leida);
    }
    
    return lista;
  }

  onFechasSeleccionadas(fechas: { desde: Date; hasta: Date }) {
    // convertimos a ISO y seteamos en el service
    const desde = fechas.desde.toISOString().split('T')[0];
    const hasta = fechas.hasta.toISOString().split('T')[0];

    this.notiService.filtroDesde.set(desde);
    this.notiService.filtroHasta.set(hasta);
  }
}
