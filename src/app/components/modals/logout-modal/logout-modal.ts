import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarData } from '../../../model/snackbar-data.model';
import { Snackbar } from '../snackbar/snackbar';

@Component({
  selector: 'app-logout-modal',
  imports: [],
  templateUrl: './logout-modal.html',
  styleUrl: './logout-modal.css',
})
export class ConfirmarLogout {
  private dialogRef = inject(MatDialogRef<ConfirmarLogout>);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  cancelar() {
    this.dialogRef.close();
  }

  confirmar() {
    this.dialogRef.close();

    const snackbarData: SnackbarData = {
      message: 'Sesión cerrada correctamente',
      iconName: 'check_circle',
    };

    this.snackBar.openFromComponent(Snackbar, {
      duration: 3000,
      verticalPosition: 'bottom',
      panelClass: 'snackbar-panel',
      data: snackbarData,
    });

    this.authService.handleLogout();

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 400);
  }
}
