import { Component, Inject, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PedidoResponse } from '../../model/pedido-response.model';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth-service';

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
  private authService = inject(AuthService);
  public role = this.authService.currentUserRole;
  constructor(@Inject(MAT_DIALOG_DATA) public pedido: PedidoResponse) {}

  aceptarPedido() {}

  RechazarPedido() {}

  cancelarPedido() {}

  verDatosDueno() {}

  verDatosCliente() {}
}
