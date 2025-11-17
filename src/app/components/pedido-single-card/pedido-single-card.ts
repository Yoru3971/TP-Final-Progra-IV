import { Component, Input } from '@angular/core';
import { PedidoResponse } from '../../model/pedido-response.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pedido-single-card',
  imports: [DatePipe],
  templateUrl: './pedido-single-card.html',
  styleUrl: './pedido-single-card.css',
})
export class PedidoSingleCard {
  @Input() pedido!: PedidoResponse;

  getFechaFormateada(): string {
    return new Date(this.pedido.fechaEntrega).toLocaleDateString('es-AR');
  }

  getEstadoColor(): string {
    switch (this.pedido.estado) {
      case 'PENDIENTE': return '#eab308'; 
      case 'ACEPTADO': return '#22c55e'; 
      case 'RECHAZADO': return '#ef4444';
      default: return '#6b7280';
    }
  }

  // REVISAR falta armar el modal
  verPedido(){
    
  }
}
