import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsuarioResponse } from '../../../model/usuario-response.model';
import { FormUserUpdate } from '../../forms/form-user-update/form-user-update';
import { UsuarioService } from '../../../services/usuario-service';
import { AuthService } from '../../../services/auth-service';
import { Snackbar } from '../../modals/snackbar/snackbar';
import { SnackbarData } from '../../../model/snackbar-data.model';
import { SuccessDialogModal } from '../../modals/success-dialog-modal/success-dialog-modal';

@Component({
  selector: 'app-datos-usuario-card',
  imports: [],
  templateUrl: './datos-usuario-card.html',
  styleUrl: './datos-usuario-card.css',
})
export class DatosUsuarioCard implements OnInit {
  private usuarioService = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private authService = inject(AuthService);

  @Input() usuario!: UsuarioResponse;

  public usuarioSignal = signal<UsuarioResponse>(this.usuario);

  ngOnInit(): void {
    if (this.usuario) {
      this.usuarioSignal.set(this.usuario);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file: File = input.files[0];

    const userId = this.usuarioSignal().id; 

    this.usuarioService.updateImagenUsuario(userId, file).subscribe({
      next: (usuarioActualizado: UsuarioResponse) => {
        this.usuarioSignal.set(usuarioActualizado);
        
        this.snackBar.openFromComponent(Snackbar, {
          duration: 3000,
          data: { 
             message: 'Foto de perfil actualizada con éxito', 
             iconName: 'check_circle' 
          } as SnackbarData,
          panelClass: 'snackbar-success' 
        });
      },
      error: (err) => {
        console.error('Error al subir imagen:', err);
        let mensaje = 'Ocurrió un error al subir la imagen.';
        if (err.status === 400) mensaje = 'Formato de imagen no válido.';
        if (err.status === 403) mensaje = 'No tienes permiso para editar esto.';

        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
      }
    });

    input.value = ''; 
  }

  openUpdateModal() {
    const dialogRef = this.dialog.open(FormUserUpdate, {
      data: this.usuario,
      width: '60rem',
      panelClass: 'form-modal',
      autoFocus: false,
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const { resp, emailCambio } = result;

      if (emailCambio) {
        this.authService.handleLogout();

        this.dialog.open(SuccessDialogModal, {
          data: { message: 'Tu email fue actualizado. Por favor iniciá sesión nuevamente.' },
          panelClass: 'modal-exito',
        });

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1400);

        return;
      }

      // Si NO cambió el email, snackbar de éxito
      const snackbarData: SnackbarData = {
        message: 'Datos actualizados correctamente',
        iconName: 'check_circle',
      };

      this.snackBar.openFromComponent(Snackbar, {
        duration: 2500,
        verticalPosition: 'bottom',
        panelClass: 'snackbar-panel',
        data: snackbarData,
      });

      this.usuarioService.getPerfilUsuario().subscribe({
        next: (data) => this.usuarioSignal.set(data),
        error: (err) => console.error(err),
      });
    });
  }
}
