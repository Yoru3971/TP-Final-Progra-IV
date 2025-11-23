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
import { DatePipe, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { PedidosService } from '../../services/pedido-service';
import { PedidoUpdateRequest } from '../../model/pedido-update-request.model';
import { EstadoPedido } from '../../shared/enums/estadoPedido.enum';
import { UsuarioResponse } from '../../model/usuario-response.model';
import { Snackbar } from '../../shared/components/snackbar/snackbar';
import { ErrorDialogModal } from '../../shared/components/error-dialog-modal/error-dialog-modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-pedido-extended-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatIconModule,
    MatDialogClose,
    DatePipe,
    FormsModule,
    CommonModule,
    MatFormField,
    MatLabel,
  ],
  templateUrl: './pedido-extended-modal.html',
  styleUrl: './pedido-extended-modal.css',
})
export class PedidoExtendedModal {
  EstadoPedido = EstadoPedido;
  private authService = inject(AuthService);
  private pedidosService = inject(PedidosService);
  private dialogRef = inject(MatDialogRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public role = this.authService.currentUserRole;
  nuevaFechaSeleccionada: string | null = null; // <--- ahora es string YYYY-MM-DD

  constructor(@Inject(MAT_DIALOG_DATA) public pedido: PedidoResponse) {}

  // CAMBIAR ESTADO
  cambiarEstado(estadoNuevo: EstadoPedido) {
    const estadoActual = this.pedido.estado;

    if (this.role() === 'CLIENTE') {
      if (estadoNuevo !== EstadoPedido.CANCELADO || estadoActual !== EstadoPedido.PENDIENTE) {
        return this.mostrarError('No tenés permiso para cambiar este estado.');
      }
    }

    if (this.role() === 'DUENO') {
      const permitido =
        estadoActual === EstadoPedido.PENDIENTE &&
        (estadoNuevo === EstadoPedido.ACEPTADO || estadoNuevo === EstadoPedido.RECHAZADO);

      if (!permitido) {
        return this.mostrarError('Solo podés aceptar o rechazar pedidos pendientes.');
      }
    }

    const body: PedidoUpdateRequest = {
      estado: estadoNuevo,
      fechaEntrega: this.pedido.fechaEntrega,
    };

    this.sendUpdate(body);
  }

  // CLIENTE — CAMBIAR FECHA
  cambiarFechaEntrega(fecha: string | null) {
    if (this.role() !== 'CLIENTE') {
      return this.mostrarError('Solo el cliente puede modificar la fecha de entrega.');
    }

    if (!fecha) {
      return this.mostrarError('Seleccioná una fecha.');
    }

    const body: PedidoUpdateRequest = {
      fechaEntrega: fecha, // ya viene como YYYY-MM-DD
    };

    this.sendUpdate(body);
  }

  private sendUpdate(body: PedidoUpdateRequest) {
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

        setTimeout(() => this.pedidosService.fetchPedidos(), 500);
        this.dialogRef.close({ updated: true });
      },
      error: (err) => {
        this.mostrarError(err.error?.message ?? 'Error desconocido al actualizar el pedido');
      },
    });
  }

  private mostrarError(message: string) {
    this.dialog.open(ErrorDialogModal, {
      data: { message },
      panelClass: 'modal-error',
    });
  }

  verDatosUsuario(usuario: UsuarioResponse) {}
}

