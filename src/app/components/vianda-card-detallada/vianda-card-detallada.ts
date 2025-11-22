import { Component, input, output } from '@angular/core';
import { ViandaResponse } from '../../model/vianda-response.model';
import { CurrencyPipe } from '@angular/common';
import { PageMode } from '../../pages/emprendimiento-page/emprendimiento-page';

@Component({
  selector: 'app-vianda-card-detallada',
  imports: [CurrencyPipe],
  templateUrl: './vianda-card-detallada.html',
  styleUrl: './vianda-card-detallada.css',
})
export class ViandaCardDetallada {

  vianda = input.required<ViandaResponse>();
  modo = input.required<PageMode>();
  
  // La cantidad la manda el carrito (creo)
  cantidad = input<number>(0);

  // Dueño
  editar = output<void>();
  // Cliente/Invitado
  agregar = output<void>();
  quitar = output<void>();

  esDueno() {
    return this.modo() === 'DUENO';
  }
}
