import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-carrito-nuevo-modal',
  imports: [],
  templateUrl: './carrito-nuevo-modal.html',
  styleUrl: './carrito-nuevo-modal.css',
})
export class CarritoNuevoModal {
  private dialogRef = inject(MatDialogRef<CarritoNuevoModal>);

  public procesar(valor: boolean) {
    this.dialogRef.close(valor);
  }
}
