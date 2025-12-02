import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioResponse } from '../../../model/usuario-response.model';

@Component({
  selector: 'app-datos-usuario-modal',
  imports: [],
  templateUrl: './datos-usuario-modal.html',
  styleUrl: './datos-usuario-modal.css',
})
export class DatosUsuarioModal {
  private dialogRef = inject(MatDialogRef<DatosUsuarioModal>);

  constructor(@Inject(MAT_DIALOG_DATA) public usuario: UsuarioResponse) {}

  cerrar() {
    this.dialogRef.close();
  }
}
