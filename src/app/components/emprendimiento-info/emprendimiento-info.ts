import {Component,computed,inject,input,output,} from '@angular/core';
import { EmprendimientoResponse } from '../../model/emprendimiento-response.model';
import { CarritoService } from '../../services/carrito-service';

@Component({
  selector: 'app-emprendimiento-info',
  imports: [],
  templateUrl: './emprendimiento-info.html',
  styleUrl: './emprendimiento-info.css',
})
export class EmprendimientoInfo {

  emprendimiento = input.required<EmprendimientoResponse>();
  modo = input.required<'CLIENTE' | 'DUENO'| 'INVITADO' | 'PROHIBIDO' | 'CARGANDO'>();

  accionPrincipal = output<void>();

  private carritoService = inject(CarritoService);

  public cantidadViandasUnicasEnCarrito = this.carritoService.cantidadViandasUnicas;

  onButtonClick() {
    this.accionPrincipal.emit();
  }

  public hayCarrito = computed(() =>
    this.modo() === 'CLIENTE' && this.carritoService.emprendimiento()?.id === this.emprendimiento().id
  );
}
