import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
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
import { DatosUsuarioModal } from '../datos-usuario-modal/datos-usuario-modal';
import { A11yModule } from "@angular/cdk/a11y";

@Component({
  selector: 'app-pedido-extended-modal',
  imports: [MatButtonModule, MatIconModule, DatePipe, FormsModule, CommonModule, A11yModule],
  templateUrl: './pedido-extended-modal.html',
  styleUrl: './pedido-extended-modal.css',
})
export class PedidoExtendedModal implements OnInit {
  EstadoPedido = EstadoPedido;
  private authService = inject(AuthService);
  private pedidosService = inject(PedidosService);
  private dialogRef = inject(MatDialogRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public role = this.authService.currentUserRole;

  nuevaFechaSeleccionada: string | null = null;
  minDate: string = '';
  esDemasiadoTarde: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public pedido: PedidoResponse) {}

  ngOnInit(): void {
    this.calcularValidacionesFecha();
  }

  calcularValidacionesFecha() {
    if (this.role() !== 'CLIENTE') return;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const [year, month, day] = this.pedido.fechaEntrega.split('-').map(Number);
    const fechaEntregaActual = new Date(year, month - 1, day);
    fechaEntregaActual.setHours(0, 0, 0, 0);

    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    if (fechaEntregaActual.getTime() === manana.getTime()) {
      this.esDemasiadoTarde = true;
    }

    // Mínimo debe ser Hoy + 2 días (ej: Si hoy es 23 -> min 25)
    const fechaMinimaPolitica = new Date(hoy);
    fechaMinimaPolitica.setDate(hoy.getDate() + 2);

    const minPoliticaStr = this.formatDate(fechaMinimaPolitica);
    const fechaOriginalStr = this.pedido.fechaEntrega;

    if (minPoliticaStr > fechaOriginalStr) {
      this.minDate = minPoliticaStr;
    } else {
      this.minDate = fechaOriginalStr;
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

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

  cambiarFechaEntrega(fecha: string | null) {
    if (this.role() !== 'CLIENTE') {
      this.mostrarError('Solo el cliente puede modificar la fecha de entrega.');
      return;
    }

    if (this.esDemasiadoTarde) {
      this.mostrarError('No podés modificar el pedido un día antes de la entrega.');
      return;
    }

    if (!fecha) {
      this.mostrarError('Seleccioná una fecha.');
      return;
    }

    if (fecha! < this.pedido.fechaEntrega) {
      this.mostrarError('La nueva fecha no puede ser anterior a la fecha original.');
      return;
    }

    const body: PedidoUpdateRequest = {
      fechaEntrega: fecha,
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

  verDatosUsuario(usuario: UsuarioResponse) {
    this.dialog.open(DatosUsuarioModal, {
      data: usuario,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  cerrar() {
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
