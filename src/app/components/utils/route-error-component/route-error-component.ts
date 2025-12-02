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

  volverInicio() {
    this.router.navigate(['/home']);
  }
}
