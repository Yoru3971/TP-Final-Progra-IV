import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Notificacion } from '../../../model/notificacion.model';

@Component({
  selector: 'app-notificacion-single-card',
  imports: [DatePipe],
  templateUrl: './notificacion-single-card.html',
  styleUrl: './notificacion-single-card.css',
})
export class NotificacionSingleCardComponent {
  @Input() notificacion!: Notificacion;
}
