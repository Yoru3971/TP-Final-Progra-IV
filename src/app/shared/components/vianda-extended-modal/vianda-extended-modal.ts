import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ViandaResponse } from '../../../model/vianda-response.model';
import { Router } from '@angular/router';
import { IconTacc } from '../iconos/icon-tacc/icon-tacc';
import { IconVegan } from '../iconos/icon-vegan/icon-vegan';
import { IconVeggie } from '../iconos/icon-veggie/icon-veggie';

@Component({
  selector: 'app-vianda-extended-modal',
  imports: [
    MatButtonModule,
    MatIconModule,
    IconTacc,
    IconVegan,
    IconVeggie,
  ],
  templateUrl: './vianda-extended-modal.html',
  styleUrl: './vianda-extended-modal.css',
})
export class ViandaExtendedModal {
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ViandaExtendedModal>,
    @Inject(MAT_DIALOG_DATA) public vianda: ViandaResponse
  ) {}

  irAlEmprendimiento() {
    const idEmprendimiento = this.vianda.emprendimiento.id;

    if (idEmprendimiento) {
      // Cierro el modal
      this.dialogRef.close();

      // Navego a la page del emprendimiento
      this.router.navigate(['/emprendimiento', idEmprendimiento]);
    } else {
      console.error('Error: Esta vianda no tiene asociado un ID de emprendimiento.');
    }
  }
}
