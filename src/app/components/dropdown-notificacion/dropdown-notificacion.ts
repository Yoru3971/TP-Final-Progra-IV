import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { NotificacionService } from '../../services/notificacion-service';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dropdown-notificacion',
  imports: [],
  templateUrl: './dropdown-notificacion.html',
  styleUrl: './dropdown-notificacion.css',
})
export class DropdownNotificacion {
  notificacionService = inject(NotificacionService);
  emprendimientoService = inject(EmprendimientoService); //lo uso luego
  router = inject(Router);

  isOpen = signal(false); //dropdown desplegado o cerrado
  elementRef: any;

  //cargo las notificaciones al montar el componente
  constructor() {
    effect( () => {
      this.notificacionService.getNotificacionesUltimaSemana();
    });
  }

  //cambio el estado
  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

  //redirijo al perfil del usuario, y ahi las mira
  verTodasNotificaciones() {
    this.router.navigate(['/me']);// nose cual es la ruta del perfil
    this.isOpen.set(false);
  }

  //aca el metodo para tener el nombre del emprendimiento desde el id
  getNombreEmprendimiento(id: number) {
    return this.emprendimientoService.getEmprendimientos();
  }

  getCantidadNotificaciones() {
    return this.notificacionService.notificaciones().length;
  }

  // cerrar el dropdown si hago click afuera del mismo
  @HostListener('document:click', ['$event'])
  clickPorFuera(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
