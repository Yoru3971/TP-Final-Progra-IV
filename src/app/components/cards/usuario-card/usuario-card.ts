import { Component, computed, inject, Input, Signal } from '@angular/core';
import { UsuarioResponse } from '../../../model/usuario-response.model';
import { EmprendimientoService } from '../../../services/emprendimiento-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuario-card',
  imports: [RouterLink],
  templateUrl: './usuario-card.html',
  styleUrl: './usuario-card.css',
})
export class UsuarioCard {
  @Input() usuario!: UsuarioResponse;

  private emprendimientoService = inject(EmprendimientoService);

  emprendimientos = computed(() =>
    this.emprendimientoService.emprendimientos().filter(datum => datum.dueno.id === this.usuario.id)
  );
}
