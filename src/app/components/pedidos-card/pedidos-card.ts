import { Component, inject, effect } from '@angular/core';
import { PedidosService } from '../../services/pedido-service';
import { PedidoSingleCard } from '../pedido-single-card/pedido-single-card';

@Component({
  selector: 'app-pedidos-card',
  imports: [PedidoSingleCard],
  templateUrl: './pedidos-card.html',
  styleUrl: './pedidos-card.css',
})
export class PedidosCard {
  pedidoService = inject(PedidosService);

  constructor() {
    effect(() => {
      this.pedidoService.fetchPedidos();
    });
  }
}