import { Component, inject } from '@angular/core';
import { CarritoService } from '../../services/carrito-service';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ViandaResponse } from '../../model/vianda-response.model';

@Component({
  selector: 'app-carrito-modal',
  imports: [],
  templateUrl: './carrito-modal.html',
  styleUrl: './carrito-modal.css',
})
export class CarritoModal {
  #dialogRef = inject(MatDialogRef<CarritoModal>);

  #carritoService = inject(CarritoService);

  emprendimiento = this.#carritoService.emprendimiento;
  viandaCantidades = this.#carritoService.viandaCantidades;

  sumarVianda(vianda: ViandaResponse) {
    this.#carritoService.agregarVianda(vianda);
  }

  restarVianda(vianda: ViandaResponse) {
    this.#carritoService.quitarVianda(vianda);
  }

  vacio() {
    return this.#carritoService.vacio();
  }

  get total() {
    return this.viandaCantidades().reduce(
        (total, viandaCantidad) => total += viandaCantidad.vianda.precio
                                          * viandaCantidad.cantidad, 0
    );
  }

  cancelarPedido() {
    if (!confirm(`¿Seguro de que querés cancelar el pedido?`)) return;

    this.#carritoService.vaciar();
    this.cerrar();
  }

  confirmarPedido() {
    if (!confirm(`¿Seguro de que querés confirmar el pedido?`)) return;
  }

  cerrar() {
    this.#dialogRef.close();
  }
}
