import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarritoConfirmarModalData } from '../../model/carrito-confirmar-modal-data.model';

@Component({
  selector: 'app-carrito-confirmar-modal',
  imports: [],
  templateUrl: './carrito-confirmar-modal.html',
  styleUrl: './carrito-confirmar-modal.css',
})
export class CarritoConfirmarModal {
  public data: CarritoConfirmarModalData = inject(MAT_DIALOG_DATA);

  private dialogRef = inject(MatDialogRef<CarritoConfirmarModal>);

  public procesar(valor: boolean) {
    this.dialogRef.close(valor);
  }
}
