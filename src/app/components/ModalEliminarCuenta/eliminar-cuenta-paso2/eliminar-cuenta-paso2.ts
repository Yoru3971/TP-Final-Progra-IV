import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from '../../../services/usuario-service';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EliminarCuentaPaso3 } from '../eliminar-cuenta-paso3/eliminar-cuenta-paso3';
import { ErrorDialogModal } from '../../../shared/components/error-dialog-modal/error-dialog-modal';

@Component({
  selector: 'app-eliminar-cuenta-paso2',
  imports: [ReactiveFormsModule],
  templateUrl: './eliminar-cuenta-paso2.html',
  styleUrl: './eliminar-cuenta-paso2.css',
})
export class EliminarCuentaPaso2 {
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<EliminarCuentaPaso2>);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  form = this.fb.group({
    confirm: ['', [Validators.required]],
  });

  eliminar() {
    const value = this.form.get('confirm')?.value?.trim().toLowerCase();

    if (value !== 'eliminar') {
      this.mostrarError("Debe escribir exactamente la palabra 'eliminar'!");
      return;
    }

    const id = this.authService.usuarioId();

    if (!id) {
      this.mostrarError('No se encontró el usuario logueado.');
      return;
    }

    this.usuarioService.eliminarCuenta(id).subscribe({
      next: () => {
        this.dialogRef.close();
        this.authService.handleLogout();

        this.dialog.open(EliminarCuentaPaso3);
      },
      error: (err) => {
        const backendMsg =
            err.error?.message || err.error?.error || 'Error desconocido al eliminar la cuenta';
            
        this.mostrarError(backendMsg);
      },
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  private mostrarError(message: string) {
      this.dialog.open(ErrorDialogModal, {
        data: { message },
        panelClass: 'modal-error',
        autoFocus: false,
        restoreFocus: false,
      });
    }
}
