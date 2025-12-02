import { Component, inject, OnInit, signal } from '@angular/core';
import { DatosUsuarioCard } from '../../components/cards/datos-usuario-card/datos-usuario-card';
import { NotificacionesCard } from '../../components/cards/notificaciones-card/notificaciones-card';
import { PedidosCard } from '../../components/cards/pedidos-card/pedidos-card';
import { PanelAccionesCuenta } from '../../components/panel-acciones-cuenta/panel-acciones-cuenta';
import { UsuarioResponse } from '../../model/usuario-response.model';
import { UsuarioService } from '../../services/usuario-service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth-service';
import { ErrorDialogModal } from '../../components/error-dialog-modal/error-dialog-modal';

@Component({
  selector: 'app-perfil-usuario',
  imports: [DatosUsuarioCard, NotificacionesCard, PedidosCard, PanelAccionesCuenta],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css',
})
export class PerfilUsuario implements OnInit {
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  usuario = signal<UsuarioResponse | null>(null);

  ngOnInit(): void {
    this.usuarioService.getPerfilUsuario().subscribe({
      next: (data) => {
        this.usuario.set(data);
      },
      error: (err) => {
        const backendMsg =
          err.error?.message || err.error?.error || 'Error desconocido con el usuario';

        this.authService.handleLogout();
        this.dialog.open(ErrorDialogModal, {
          data: { message: backendMsg },
          panelClass: 'modal-error',
          autoFocus: false,
          restoreFocus: false,
        });
      },
    });
  }
}
