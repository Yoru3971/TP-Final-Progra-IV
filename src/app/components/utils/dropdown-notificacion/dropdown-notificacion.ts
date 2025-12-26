import { Component, ElementRef, HostListener, inject, signal, effect } from '@angular/core';
import { NotificacionService } from '../../../services/notificacion-service';
import { EmprendimientoService } from '../../../services/emprendimiento-service';
import { Router } from '@angular/router';
import { NotificacionSingleCardComponent } from '../../cards/notificacion-single-card/notificacion-single-card';

@Component({
  selector: 'app-dropdown-notificacion',
  imports: [NotificacionSingleCardComponent],
  templateUrl: './dropdown-notificacion.html',
  styleUrl: './dropdown-notificacion.css',
})
export class DropdownNotificacion {
  public notificacionService = inject(NotificacionService);
  private emprendimientoService = inject(EmprendimientoService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  isOpen = signal(false);

  constructor() {
    effect(() => {
       this.notificacionService.fetchNotificaciones(); 
    });
  }

  toggleDropdown() {
    this.isOpen.update((v) => !v);
  }

  verTodasNotificaciones() {
    this.router.navigate(['/me']);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  clickPorFuera(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
