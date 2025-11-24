import { Component, effect, ElementRef, HostListener, inject, signal } from '@angular/core';
import { NotificacionService } from '../../services/notificacion-service';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { Router } from '@angular/router';
import { NotificacionSingleCardComponent } from '../../shared/components/notificacion-single-card/notificacion-single-card';

@Component({
  selector: 'app-dropdown-notificacion',
  imports: [NotificacionSingleCardComponent],
  templateUrl: './dropdown-notificacion.html',
  styleUrl: './dropdown-notificacion.css',
})
export class DropdownNotificacion {
  notificacionService = inject(NotificacionService);
  emprendimientoService = inject(EmprendimientoService);
  router = inject(Router);

  isOpen = signal(false);
  // REVISAR Esto es para que desaparezca el numerito de notificaciones, pero hay que ver como manejarlo bien, porque al recargar se resetea esto
  firstOpen = signal(true);

  private elementRef = inject(ElementRef);

  constructor() {
    effect(() => {
      this.notificacionService.fetchNotificacionesUltimaSemana();
    });
  }

  toggleDropdown() {
    const newState = !this.isOpen();

    this.isOpen.set(newState);

    // Si abre por primera vez -> limpiar badge
    if (newState && this.firstOpen()) {
      this.firstOpen.set(false);
    }
  }

  verTodasNotificaciones() {
    this.router.navigate(['/me']);
    this.isOpen.set(false);
  }

  getCantidadNotificaciones() {
    return this.notificacionService.notificacionesOrdenadas().length;
  }

  @HostListener('document:click', ['$event'])
  clickPorFuera(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
