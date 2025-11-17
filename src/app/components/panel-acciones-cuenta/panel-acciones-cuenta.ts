import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarData } from '../../model/snackbar-data.model';
import { Snackbar } from '../../shared/components/snackbar/snackbar';
import { EliminarCuentaPaso1 } from '../ModalEliminarCuenta/eliminar-cuenta-paso1/eliminar-cuenta-paso1';

@Component({
  selector: 'app-panel-acciones-cuenta',
  imports: [],
  templateUrl: './panel-acciones-cuenta.html',
  styleUrl: './panel-acciones-cuenta.css',
})
export class PanelAccionesCuenta {
  private dialog = inject(MatDialog);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  cambiarPassword() {
    /*
    this.dialog.open(CambiarPasswordModal, {
      panelClass: 'modal-panel',
    });
    */
    alert('Funcionalidad de cambio de contraseña en desarrollo.');
  }

  cerrarSesion() {
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
    }, 1000);
  }

  eliminarCuenta() {
    this.dialog.open(EliminarCuentaPaso1);
  }
}
