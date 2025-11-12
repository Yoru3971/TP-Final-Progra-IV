import { Component, inject } from '@angular/core';
import { FormRegistro } from '../../shared/components/form-registro/form-registro';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page-dueno',
  imports: [FormRegistro, RouterLink],
  templateUrl: './register-page-dueno.html',
  styleUrl: './register-page-dueno.css',
})
export class RegisterPageDueno {
  private route = inject(ActivatedRoute);

  rolUsuario = (this.route.snapshot.data['rol'] || 'DUENO'); //El rol viene de la URL, si no está definido, por defecto es 'DUENO'
}
