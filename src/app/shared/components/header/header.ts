import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserRole } from '../../../services/auth-service';
import { CitySelector } from '../../../components/city-selector/city-selector';
import { SearchBar } from '../../../components/search-bar/search-bar';
import { DropdownNotificacion } from '../../../components/dropdown-notificacion/dropdown-notificacion';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarLogout } from '../logout-modal/logout-modal';
import { Snackbar } from '../snackbar/snackbar';
import { SnackbarData } from '../../../model/snackbar-data.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, CitySelector, SearchBar, DropdownNotificacion],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  public role = this.authService.currentUserRole;

  isLoggedIn = computed(() => this.role() !== 'INVITADO');

  notifications = input<string[]>([]);

  @Output() loginClicked = new EventEmitter<void>();
  @Output() profileClicked = new EventEmitter<void>();
  @Output() searchSubmitted = new EventEmitter<string>();

  notificationMenuOpen = signal(false);

  toggleNotificationMenu() {
    this.notificationMenuOpen.update((open) => !open);
  }

  onLogin() {
    this.loginClicked.emit();
  }

  onLogout() {
    const dialogRef = this.dialog.open(ConfirmarLogout);

    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
    if (confirmado) {

      this.authService.handleLogout();
      this.router.navigate(['/home']);

    const snackbarData: SnackbarData = {
          message: 'Sesión cerrada',
          iconName: 'check_circle'
        }
    
    this.snackBar.openFromComponent(Snackbar, {
      duration: 3000,
      verticalPosition: 'bottom',
      panelClass: 'snackbar-panel',
      data: snackbarData
    });
    }
  });
  }

  onSearch(event: Event, searchInput: HTMLInputElement) {
    event.preventDefault(); 
    if (searchInput.value) {
      this.searchSubmitted.emit(searchInput.value);
    }
  }
}
