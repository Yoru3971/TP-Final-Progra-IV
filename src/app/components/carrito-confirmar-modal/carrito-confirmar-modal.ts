import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-carrito-confirmar-modal',
  imports: [],
  templateUrl: './carrito-confirmar-modal.html',
  styleUrl: './carrito-confirmar-modal.css',
})
export class CarritoConfirmarModal {
  private dialogRef = inject(MatDialogRef<CarritoConfirmarModal>);

  public procesar(valor: boolean) {
    this.dialogRef.close(valor);
  }
}
