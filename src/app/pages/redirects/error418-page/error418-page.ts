import { Component } from '@angular/core';
import { RouteErrorComponent } from '../../../components/utils/route-error-component/route-error-component';

@Component({
  selector: 'app-error418-page',
  imports: [RouteErrorComponent],
  templateUrl: './error418-page.html',
  styleUrl: './error418-page.css',
})
export class Error418Page {
  imgUrl = 'error418.png';
  titulo = "ERROR 418: I'M A TEAPOT";
  mensaje = 'SOY UNA TETERA. NO PUEDO PREPARAR CAFÉ.';
}
