import { Component, Inject, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogClose,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PedidoResponse } from '../../model/pedido-response.model';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { PedidosService } from '../../services/pedido-service';
import { PedidoUpdateRequest } from '../../model/pedido-update-request.model';
import { EstadoPedido } from '../../shared/enums/estadoPedido.enum';
import { UsuarioResponse } from '../../model/usuario-response.model';
import { Snackbar } from '../../shared/components/snackbar/snackbar';
import { ErrorDialogModal } from '../../shared/components/error-dialog-modal/error-dialog-modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatosUsuarioModal } from '../datos-usuario-modal/datos-usuario-modal';

@Component({
  selector: 'app-pedido-extended-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatIconModule,
    MatDialogClose,
    DatePipe,
  ],
  templateUrl: './pedido-extended-modal.html',
  styleUrl: './pedido-extended-modal.css',
})
export class PedidoExtendedModal {
  EstadoPedido = EstadoPedido; // para usarlo en el HTML
  private authService = inject(AuthService);
  private pedidosService = inject(PedidosService);
  private dialogRef = inject(MatDialogRef);
  public role = this.authService.currentUserRole;
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  constructor(@Inject(MAT_DIALOG_DATA) public pedido: PedidoResponse) {}

  cambiarEstadoPedido(estadoUpd: EstadoPedido) {
    const body: PedidoUpdateRequest = {
      estado: estadoUpd,
      fechaEntrega: this.pedido.fechaEntrega,
    };
    console.log('ID:', this.pedido.id, 'Estado:', estadoUpd);

    this.pedidosService.updatePedido(this.pedido.id, body).subscribe({
      next: () => {
        const data = {
          message: 'Pedido actualizado correctamente',
          iconName: 'check_circle',
        };

        this.snackBar.openFromComponent(Snackbar, {
          duration: 3000,
          verticalPosition: 'bottom',
          panelClass: 'snackbar-panel',
          data,
        });

        setTimeout(() => {
          this.pedidosService.fetchPedidos();
        }, 500);

        this.dialogRef.close({ updated: true });
      },
      error: (err) => {
        this.dialog.open(ErrorDialogModal, {
          data: {
            message: err.error?.message ?? 'Error desconocido al actualizar el pedido',
          },
          panelClass: 'modal-error',
        });
      },
    });
  }

  verDatosUsuario(usuario: UsuarioResponse) {
    this.dialog.open(DatosUsuarioModal, {
      data: usuario,
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
