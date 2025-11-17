import { Component, inject, OnInit } from '@angular/core';
import { NotificacionService } from '../../services/notificacion-service';
import { NotificacionSingleCardComponent } from '../../shared/components/notificacion-single-card/notificacion-single-card';


@Component({
  selector: 'app-notificaciones-card',
  imports: [NotificacionSingleCardComponent],
  templateUrl: './notificaciones-card.html',
  styleUrl: './notificaciones-card.css',
})
export class NotificacionesCard implements OnInit {
  private notiService = inject(NotificacionService);

  cargando = true;

  ngOnInit() {
    this.notiService.fetchNotificaciones();
    setTimeout(() => this.cargando = false, 300);
  }

  get lista() {
    return this.notiService.notificacionesOrdenadas();
  }
}
