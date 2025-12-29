import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormReclamo } from '../../components/forms/form-reclamo/form-reclamo';
import { ReclamoService } from '../../services/reclamo-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReclamoRequest } from '../../model/reclamo-request.model';
import { ErrorDialogModal } from '../../components/modals/error-dialog-modal/error-dialog-modal';

@Component({
  selector: 'app-reclamo-page',
  imports: [CommonModule, FormReclamo],
  templateUrl: './reclamo-page.html',
  styleUrl: './reclamo-page.css',
})
export class ReclamoPage {
  private reclamoService = inject(ReclamoService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  @ViewChild(FormReclamo) formComponent!: FormReclamo;

  enviarReporte(reclamo: ReclamoRequest) {
    this.reclamoService.enviarReclamo(reclamo).subscribe({
      next: (mensaje) => {
        this.snackBar.open('¡Reporte enviado! Revisa tu correo.', 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'bottom'
        });
        
        this.formComponent.resetForm();
      },
      error: (err) => {
        const backendMsg = err.error || 'No se pudo enviar el reporte. Intenta más tarde.';
        
        this.dialog.open(ErrorDialogModal, {
          data: { message: backendMsg },
          panelClass: 'modal-error',
          autoFocus: false
        });
      }
    });
  }
}
