import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EliminarCuentaPaso1 } from '../ModalEliminarCuenta/eliminar-cuenta-paso1/eliminar-cuenta-paso1';
import { ConfirmarLogout } from '../../shared/components/logout-modal/logout-modal';
import { CambiarPasswordModal } from '../cambiar-password-modal/cambiar-password-modal';

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
    
    this.dialog.open(CambiarPasswordModal, {
      panelClass: 'modal-panel',
      width: '80rem',
    });
  }

  cerrarSesion() {
    this.dialog.open(ConfirmarLogout);
  }

  eliminarCuenta() {
    this.dialog.open(EliminarCuentaPaso1);
  }
}
