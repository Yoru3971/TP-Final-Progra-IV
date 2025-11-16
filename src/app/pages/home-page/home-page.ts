import { Component, effect, inject } from '@angular/core';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { ViandaService } from '../../services/vianda-service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmprendimientoCard } from '../../components/emprendimiento-card/emprendimiento-card';
import { EmprendimientoConViandas } from '../../model/emprendimiento-con-viandas.model';
import { EmprendimientoCardSkeleton } from '../../components/emprendimiento-card-skeleton/emprendimiento-card-skeleton';


@Component({
  selector: 'app-home-page',
  imports: [EmprendimientoCard, EmprendimientoCardSkeleton],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  private emprendimientoService = inject(EmprendimientoService);
  private viandaService = inject(ViandaService);

  emprendimientos: EmprendimientoConViandas[] = [];

  ngOnInit() {
    // Cargar emprendimientos desde el service (actualiza el signal)
    this.emprendimientoService.fetchEmprendimientos();

    // Crear un efecto que se dispara cuando cambia la lista de emprendimientos
    effect(() => {
      const emps = this.emprendimientoService.emprendimientos();

      if (emps.length === 0) {
        this.emprendimientos = [];
        return;
      }

      // Crear requests para traer viandas de cada emprendimiento
      const requests = emps.map(e =>
        this.viandaService.getViandasByEmprendimientoId(e.id).pipe(
          map(viandas => ({
            ...e,
            viandas,
          }))
        )
      );

      forkJoin(requests).subscribe(fullData => {
        this.emprendimientos = fullData;
      });
    });
  }
}
