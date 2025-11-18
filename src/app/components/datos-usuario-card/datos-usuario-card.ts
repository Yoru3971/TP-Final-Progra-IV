import { Component, Input } from '@angular/core';
import { UsuarioResponse } from '../../model/usuario-response.model';

@Component({
  selector: 'app-datos-usuario-card',
  imports: [],
  templateUrl: './datos-usuario-card.html',
  styleUrl: './datos-usuario-card.css',
})
export class DatosUsuarioCard {
  @Input() usuario!: UsuarioResponse;

  //REVISAR aca deberia ir el metodo de editar datos usuario

}
