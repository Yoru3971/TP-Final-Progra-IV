import { Component, inject } from '@angular/core';
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
    // Traemos todos los emprendimientos

    this.emprendimientoService.getEmprendimientos().subscribe((emps) => {
      // Por cada uno creamos un observable que trae sus viandas
      const requests = emps.map((e) =>
        this.viandaService.getViandasByEmprendimientoId(e.id).pipe(
          // Cuando llegan las viandas, las combinamos con los datos del emprendimiento
          map((viandas) => ({
            ...e, // id, nombre, direccion, etc.
            viandas, // agregamos la lista de viandas
          }))
        )
      );
      // forkJoin ejecuta todos los requests en paralelo y espera a que TODOS terminen
      forkJoin(requests).subscribe((fullData) => {
        this.emprendimientos = fullData; // Guardamos el resultado final en la variable que se usa en el HTML con @for
      });
    });
  }
}
