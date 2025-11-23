import { Component, inject, OnInit } from '@angular/core';
import { PedidosService } from '../../services/pedido-service';
import { PedidoSingleCard } from '../pedido-single-card/pedido-single-card';
import { DateRangePickerComponent } from '../../shared/components/date-range-picker/date-range-picker';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { EstadoPedido } from '../../shared/enums/estadoPedido.enum';

@Component({
  selector: 'app-pedidos-card',
  imports: [PedidoSingleCard, DateRangePickerComponent],
  templateUrl: './pedidos-card.html',
  styleUrl: './pedidos-card.css',
})
export class PedidosCard implements OnInit {
  pedidoService = inject(PedidosService);

  estados = Object.values(EstadoPedido);
  
  ngOnInit() {
    this.pedidoService.fetchPedidos();
  }

  actualizarEstado(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    if (value === 'null' || value === '') {
      this.pedidoService.filtroEstado.set(null);
    } else {
      this.pedidoService.filtroEstado.set(value as EstadoPedido);
    }
  }

  actualizarEmprendimiento(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    if (value === 'null' || value === '') {
      this.pedidoService.filtroEmprendimiento.set(null);
    } else {
      this.pedidoService.filtroEmprendimiento.set(value);
    }
  }
}
