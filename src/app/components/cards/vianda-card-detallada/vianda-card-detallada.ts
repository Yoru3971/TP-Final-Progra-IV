import { Component, inject, input, output } from '@angular/core';
import { ViandaResponse } from '../../../model/vianda-response.model';
import { PageMode } from '../../../pages/emprendimiento-page/emprendimiento-page';
import { IconTacc } from '../../utils/icon-tacc/icon-tacc';
import { IconVegan } from '../../utils/icon-vegan/icon-vegan';
import { IconVeggie } from '../../utils/icon-veggie/icon-veggie';
import { CarritoService } from '../../../services/carrito-service';

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

  private carritoService = inject(CarritoService);

  esDueno() {
    return this.modo() === 'DUENO';
  }

  public cantidadViandaEnMinimo(vianda: ViandaResponse) {
    return this.carritoService.cantidadViandaEnMinimo(vianda);
  }

  public cantidadViandaEnMaximo(vianda: ViandaResponse) {
    return this.carritoService.cantidadViandaEnMaximo(vianda);
  }
}
