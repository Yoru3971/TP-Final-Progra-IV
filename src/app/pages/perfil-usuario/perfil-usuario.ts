import { Component, Input} from '@angular/core';
import { DatosUsuarioCard } from '../../components/datos-usuario-card/datos-usuario-card';
import { NotificacionesCard } from '../../components/notificaciones-card/notificaciones-card';
import { PedidosCard } from '../../components/pedidos-card/pedidos-card';
import { PanelAccionesCuenta } from '../../components/panel-acciones-cuenta/panel-acciones-cuenta';

@Component({
  selector: 'app-perfil-usuario',
  imports: [DatosUsuarioCard, NotificacionesCard, PedidosCard, PanelAccionesCuenta],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css',
})
export class PerfilUsuario {

}
