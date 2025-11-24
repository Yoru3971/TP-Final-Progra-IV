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

  cancelar() {
    this.dialogRef.close();
  }

  confirmar() {
    this.dialogRef.close(true);
  }
}
