import { Component, inject, OnInit } from '@angular/core';
import { PedidosService } from '../../services/pedido-service';
import { PedidoSingleCard } from '../pedido-single-card/pedido-single-card';

@Component({
  selector: 'app-pedidos-card',
  imports: [PedidoSingleCard],
  templateUrl: './pedidos-card.html',
  styleUrl: './pedidos-card.css',
})
export class PedidosCard implements OnInit{
  pedidoService = inject(PedidosService);


  //saco el constructor pq el effect no trabaja sobre ningun signal
  ngOnInit() {
  this.pedidoService.fetchPedidos();
}

}