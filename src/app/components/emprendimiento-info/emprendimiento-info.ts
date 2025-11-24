import { Component, input, output } from '@angular/core';
import { EmprendimientoResponse } from '../../model/emprendimiento-response.model';

@Component({
  selector: 'app-emprendimiento-info',
  imports: [],
  templateUrl: './emprendimiento-info.html',
  styleUrl: './emprendimiento-info.css',
})
export class EmprendimientoInfo {
  emprendimiento = input.required<EmprendimientoResponse>();
  modo = input.required<'CLIENTE' | 'DUENO' | 'INVITADO' | 'PROHIBIDO' | 'CARGANDO'>();
  showImagenModal = false;
  imagenModalUrl?: String;

  accionPrincipal = output<void>();

  onButtonClick() {
    this.accionPrincipal.emit();
  }

  openImagenModal() {
    const url = this.emprendimiento().imagenUrl;
    if (!url) return;

    this.imagenModalUrl = url;
    this.showImagenModal = true;
  }

  closeImagenModal() {
    this.showImagenModal = false;
  }
}
