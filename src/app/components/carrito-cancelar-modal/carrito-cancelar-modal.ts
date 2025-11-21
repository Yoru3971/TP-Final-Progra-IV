import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-carrito-cancelar-modal',
  imports: [],
  templateUrl: './carrito-cancelar-modal.html',
  styleUrl: './carrito-cancelar-modal.css',
})
export class CarritoCancelarModal {
  private dialogRef = inject(MatDialogRef<CarritoCancelarModal>);

  public procesar(valor: boolean) {
    this.dialogRef.close(valor);
  }
}
