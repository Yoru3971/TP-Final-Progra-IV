import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarData } from '../../model/snackbar-data.model';
import { Snackbar } from '../../shared/components/snackbar/snackbar';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordRequest } from '../../model/change-password-request.model';

@Component({
  selector: 'app-cambiar-password-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './cambiar-password-modal.html',
  styleUrl: './cambiar-password-modal.css',
})
export class CambiarPasswordModal {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<CambiarPasswordModal>);

  showActual = false;
  showNueva = false;

  form = this.fb.group({
    actual: ['', Validators.required],
    nueva: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/
        ),
      ],
    ],
  });

  toggleActual() {
    this.showActual = !this.showActual;
  }

  toggleNueva() {
    this.showNueva = !this.showNueva;
  }

  cancelar() {
    this.dialogRef.close();
  }

  actualizar() {
    if (this.form.invalid) return;

    const body: ChangePasswordRequest = {
      passwordActual: this.form.value.actual!,
      passwordNueva: this.form.value.nueva!,
    };

    this.usuarioService.cambiarPassword(body).subscribe({
      next: () => {
        const data: SnackbarData = {
          message: 'Contraseña actualizada correctamente',
          iconName: 'check_circle',
        };

        this.snackBar.openFromComponent(Snackbar, {
          duration: 3000,
          verticalPosition: 'bottom',
          panelClass: 'snackbar-panel',
          data,
        });

        this.dialogRef.close();
      },
      error: (err) => {
        alert(err.error?.message ?? 'Error desconocido al cambiar la contraseña.');
      },
    });
  }
}
