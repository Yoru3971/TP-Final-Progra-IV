import { Component } from '@angular/core';
import { RouteErrorComponent } from '../../../shared/components/route-error-component/route-error-component';

@Component({
  selector: 'app-error403-page',
  imports: [RouteErrorComponent],
  templateUrl: './error403-page.html',
  styleUrl: './error403-page.css',
})
export class Error403Page {
  imgURl = 'error403.png';
  titulo = 'ERROR 403: FORBIDDEN';
  mensaje = 'PARECE QUE NO TENES AUTORIZACIÓN PARA ACCEDER A ESTA RUTA';
}
