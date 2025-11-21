import { Component, input, output } from '@angular/core';
import { ViandaResponse } from '../../model/vianda-response.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-vianda-card-detallada',
  imports: [CurrencyPipe],
  templateUrl: './vianda-card-detallada.html',
  styleUrl: './vianda-card-detallada.css',
})
export class ViandaCardDetallada {

  // REVISAR si esto queda así o va en otro lado (carrito)
  vianda = input.required<ViandaResponse>();
  modo = input.required<'dueno' | 'cliente'>();
  
  cantidad = input<number>(0); 

  editar = output<ViandaResponse>(); 
  cantidadChange = output<number>();

  esDueno() {
    return this.modo() === 'dueno';
  }

  incrementar() {
    const nuevaCantidad = this.cantidad() + 1;
    this.cantidadChange.emit(nuevaCantidad);
  }

  decrementar() {
    if (this.cantidad() > 0) {
      const nuevaCantidad = this.cantidad() - 1;
      this.cantidadChange.emit(nuevaCantidad);
    }
  }

}
