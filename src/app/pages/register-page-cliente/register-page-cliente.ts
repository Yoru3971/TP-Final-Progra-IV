import { Component, inject } from '@angular/core';
import { FormRegistro } from '../../shared/components/form-registro/form-registro';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page-cliente',
  imports: [FormRegistro, RouterLink],
  templateUrl: './register-page-cliente.html',
  styleUrl: './register-page-cliente.css',
})
export class RegisterPageCliente {
  private route = inject(ActivatedRoute);

  rolUsuario = (this.route.snapshot.data['rol'] || 'CLIENTE');
}
