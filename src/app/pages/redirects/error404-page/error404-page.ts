import { Component } from '@angular/core';
import { RouteErrorComponent } from '../../../components/route-error-component/route-error-component';

@Component({
  selector: 'app-error404-page',
  imports: [RouteErrorComponent],
  templateUrl: './error404-page.html',
  styleUrl: './error404-page.css',
})
export class Error404Page {
  imgURl = 'error404.png';
  titulo = 'ERROR 404: NOT FOUND';
  mensaje = 'PARECE QUE NO EXISTE LA RUTA A LA QUE QUERES ACCEDER';
}
