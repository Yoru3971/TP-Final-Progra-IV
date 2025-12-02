import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsuarioResponse } from '../../../model/usuario-response.model';
import { FormUserUpdate } from '../../form-user-update/form-user-update';
import { UsuarioService } from '../../../services/usuario-service';
import { AuthService } from '../../../services/auth-service';
import { Snackbar } from '../../snackbar/snackbar';
import { SnackbarData } from '../../../model/snackbar-data.model';
import { SuccessDialogModal } from '../../success-dialog-modal/success-dialog-modal';

@Component({
  selector: 'app-datos-usuario-card',
  imports: [],
  templateUrl: './datos-usuario-card.html',
  styleUrl: './datos-usuario-card.css',
})
export class DatosUsuarioCard implements OnInit {
  private usuarioService = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private authService = inject(AuthService);

  @Input() usuario!: UsuarioResponse;

  public usuarioSignal = signal<UsuarioResponse>(this.usuario);

  ngOnInit(): void {
    if (this.usuario) {
      this.usuarioSignal.set(this.usuario);
    }
  }

  openUpdateModal() {
    const dialogRef = this.dialog.open(FormUserUpdate, {
      data: this.usuario,
      width: '60rem',
      panelClass: 'form-modal',
      autoFocus: false,
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const { resp, emailCambio } = result;

      if (emailCambio) {
        this.authService.handleLogout();

        this.dialog.open(SuccessDialogModal, {
          data: { message: 'Tu email fue actualizado. Por favor iniciá sesión nuevamente.' },
          panelClass: 'modal-exito',
        });

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1400);

        return;
      }

      // Si NO cambió el email, snackbar de éxito
      const snackbarData: SnackbarData = {
        message: 'Datos actualizados correctamente',
        iconName: 'check_circle',
      };

      this.snackBar.openFromComponent(Snackbar, {
        duration: 2500,
        verticalPosition: 'bottom',
        panelClass: 'snackbar-panel',
        data: snackbarData,
      });

      this.usuarioService.getPerfilUsuario().subscribe({
        next: (data) => this.usuarioSignal.set(data),
        error: (err) => console.error(err),
      });
    });
  }
}
