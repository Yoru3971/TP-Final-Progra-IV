import { Component, input, output } from '@angular/core';
import { ViandaResponse } from '../../model/vianda-response.model';
import { PageMode } from '../../pages/emprendimiento-page/emprendimiento-page';
import { IconTacc } from '../../shared/components/iconos/icon-tacc/icon-tacc';
import { IconVegan } from '../../shared/components/iconos/icon-vegan/icon-vegan';
import { IconVeggie } from '../../shared/components/iconos/icon-veggie/icon-veggie';

@Component({
  selector: 'app-vianda-card-detallada',
  imports: [IconTacc, IconVegan, IconVeggie],
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
