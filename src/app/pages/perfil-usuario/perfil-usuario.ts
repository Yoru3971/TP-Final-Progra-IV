import { Component, inject, OnInit, signal } from '@angular/core';
import { DatosUsuarioCard } from '../../components/datos-usuario-card/datos-usuario-card';
import { NotificacionesCard } from '../../components/notificaciones-card/notificaciones-card';
import { PedidosCard } from '../../components/pedidos-card/pedidos-card';
import { PanelAccionesCuenta } from '../../components/panel-acciones-cuenta/panel-acciones-cuenta';
import { UsuarioResponse } from '../../model/usuario-response.model';
import { UsuarioService } from '../../services/usuario-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-perfil-usuario',
  imports: [DatosUsuarioCard, NotificacionesCard, PedidosCard, PanelAccionesCuenta],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css',
})
export class PerfilUsuario implements OnInit {
  private usuarioService = inject(UsuarioService);

  usuario = signal<UsuarioResponse | null>(null);

  //REVISAR manejo de errores con modal
  ngOnInit(): void {
    this.usuarioService.getPerfilUsuario().subscribe({
      next: (data) => {
        this.usuario.set(data);
      },
      error: (err) => console.error(err),
    });
  }
}
