import { Component, EventEmitter, inject, input, Input, output, Output } from '@angular/core';
import { EmprendimientoResponse } from '../../model/emprendimiento-response.model';

@Component({
  selector: 'app-emprendimiento-info',
  imports: [],
  templateUrl: './emprendimiento-info.html',
  styleUrl: './emprendimiento-info.css',
})
export class EmprendimientoInfo {

  datos = input.required<EmprendimientoResponse>();
  modo = input.required<'CLIENTE' | 'DUENO'| 'INVITADO' | 'PROHIBIDO' | 'CARGANDO'>();

  accionPrincipal = output<void>();

  onButtonClick() {
    this.accionPrincipal.emit();
  }
}
