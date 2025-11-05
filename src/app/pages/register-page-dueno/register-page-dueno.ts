import { Component, inject } from '@angular/core';
import { FormRegistro } from '../../shared/form-registro/form-registro';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register-page-dueno',
  imports: [FormRegistro],
  templateUrl: './register-page-dueno.html',
  styleUrl: './register-page-dueno.css',
})
export class RegisterPageDueno {
  private route = inject(ActivatedRoute);
  rolUsuario = (this.route.snapshot.paramMap.get('rol') || 'DUENO').toUpperCase(); //El rol viene de la URL, si no está definido, por defecto es 'DUENO'
}
