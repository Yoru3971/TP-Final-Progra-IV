import { Component, HostListener, inject, OnInit } from '@angular/core';
import { PedidosService } from '../../services/pedido-service';
import { PedidoSingleCard } from '../pedido-single-card/pedido-single-card';
import { DateRangePickerComponent } from '../../shared/components/date-range-picker/date-range-picker';
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

  openEstado = false;
  openEmp = false;

  toggleEstado(event: MouseEvent) {
    this.openEstado = !this.openEstado;
    event.stopPropagation();
  }

  toggleEmp(event: MouseEvent) {
    this.openEmp = !this.openEmp;
    event.stopPropagation();
  }

  setEstado(value: EstadoPedido | null) {
    this.pedidoService.filtroEstado.set(value);
    this.openEstado = false;
  }

  setEmp(value: string | null) {
    this.pedidoService.filtroEmprendimiento.set(value);
    this.openEmp = false;
  }

  /* Cerrar ambos selects cuando se clickea afuera */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const inside = (event.target as HTMLElement).closest('.select-custom');
    if (!inside) {
      this.openEstado = false;
      this.openEmp = false;
    }
  }
}
