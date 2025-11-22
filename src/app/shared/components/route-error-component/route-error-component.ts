import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-route-error-component',
  imports: [],
  templateUrl: './route-error-component.html',
  styleUrl: './route-error-component.css',
})
export class RouteErrorComponent {
  @Input() imgUrl!: string;
  @Input() titulo!: string;
  @Input() mensajeError!: string;

  private router = inject(Router);

  volverAtras() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/home']);
    }
  }

  volverInicio(){
    this.router.navigate(['/home']);
  }
}
