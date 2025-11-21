import { Component, Inject, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogClose,
  MatDialogRef,
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
  constructor(@Inject(MAT_DIALOG_DATA) public pedido: PedidoResponse) {}

  cambiarEstadoPedido(estadoUpd: EstadoPedido) {
  const body: PedidoUpdateRequest = {
    estado: estadoUpd,
    fechaEntrega: this.pedido.fechaEntrega, // debe ser yyyy-MM-dd
  };

  this.pedidosService.updatePedido(this.pedido.id, body)
    .subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (err) => {
        console.error("Error al actualizar pedido", err);
      }
    });
}

  // REVISAR para el boton de contactar, deberia abrir un modal
  verDatosUsuario(usuario: UsuarioResponse) {}
}
