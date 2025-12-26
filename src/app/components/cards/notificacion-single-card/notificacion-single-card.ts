import { Component, inject, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Notificacion } from '../../../model/notificacion.model';
import { NotificacionService } from '../../../services/notificacion-service';

@Component({
  selector: 'app-notificacion-single-card',
  imports: [DatePipe],
  templateUrl: './notificacion-single-card.html',
  styleUrl: './notificacion-single-card.css',
})
export class NotificacionSingleCardComponent {
  private notificacionService = inject(NotificacionService);

  @Input() notificacion!: Notificacion;

  marcarLeida(event: Event) {
    event.stopPropagation();
    if (!this.notificacion.leida) {
      this.notificacionService.marcarComoLeida(this.notificacion.id);
    }
  }
}
