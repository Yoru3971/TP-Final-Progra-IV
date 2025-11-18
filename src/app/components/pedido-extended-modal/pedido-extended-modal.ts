import { Component, Inject } from '@angular/core';
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

@Component({
  selector: 'app-pedido-extended-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    MatButtonModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './pedido-extended-modal.html',
  styleUrl: './pedido-extended-modal.css',
})
export class PedidoExtendedModal {
    constructor(@Inject(MAT_DIALOG_DATA) public pedido: PedidoResponse) {}
}
