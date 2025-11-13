import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { RouterLink } from "@angular/router";

import { AuthService, UserRole } from '../../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink,
    CommonModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);

  public role = this.authService.currentUserRole;

  // agrego un  signal que me diga si tengo algo logueado para mostrar
  // o no, el boton de perfil o logout, o sino login
  isLoggedIn = computed( () => this.role() !== 'INVITADO');

  //Recibo la lista de notificaciones (solo para logueados), DEBERIA SER SIGNAL?
  notifications = input<string[]>([]);
  
  @Output() loginClicked = new EventEmitter<void>();
  @Output() profileClicked = new EventEmitter<void>();
  @Output() searchSubmitted = new EventEmitter<string>();

  notificationMenuOpen = signal(false);

  //Muestro o oculto el menu de notificaciones
  toggleNotificationMenu() {
    this.notificationMenuOpen.update(open => !open)
  }

  //Emito el evento para que el componente padre muestre el login
  onLogin() {
    this.loginClicked.emit();
  }

  //llamada al servicio de Auth para cerrar sesion
  onLogout() {
    this.authService.handleLogout();
  }

  //emito el evento para el padre navegue al perfil
  onProfileClick() {
    this.profileClicked.emit();
  }

  onSearch(event: Event, searchInput: HTMLInputElement) {
    event.preventDefault(); //evito que la pagina se recargue
    if (searchInput.value) {
      this.searchSubmitted.emit(searchInput.value);
    }
  }
}
