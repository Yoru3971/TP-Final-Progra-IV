import { Component, inject, effect, signal, OnInit } from '@angular/core';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { ViandaService } from '../../services/vianda-service';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EmprendimientoCard } from '../../components/emprendimiento-card/emprendimiento-card';
import { EmprendimientoConViandas } from '../../model/emprendimiento-con-viandas.model';
import { EmprendimientoCardSkeleton } from '../../components/emprendimiento-card-skeleton/emprendimiento-card-skeleton';

@Component({
  selector: 'app-home-page',
  imports: [EmprendimientoCard, EmprendimientoCardSkeleton],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  private emprendimientoService = inject(EmprendimientoService);
  private viandaService = inject(ViandaService);

  emprendimientos = signal<EmprendimientoConViandas[]>([]);

  constructor() {
    //efecto que se dispara cuando cambia la signal de emprendimientos
    effect(() => {
      const emps = this.emprendimientoService.emprendimientos();
      if (!emps || emps.length === 0) {
        this.emprendimientos.set([]);
        return;
      }

      //creamos las requests necesarias para traer viandas de cada emprendimiento
      //para cada emprendimiento (e) creamos un observable que trae sus viandas
      const requests = emps.map((e) =>
        this.viandaService.getViandasByEmprendimientoId(e.id).pipe(
          catchError(() => of([])), // ← si da 404, devolvemos []
          map((viandas) => ({ ...e, viandas }))
        )
      );

      //combina multiples obserbables y espera que todos terminen antes de emitir un resultado
      //forkJoin espera a que todos los observables de viandas terminen.
      //cuando todos terminan devuelve el array (fullData) con cada emprendimiento y sus viandas combinadas
      forkJoin(requests).subscribe((fullData) => {
        setTimeout(() => this.emprendimientos.set(fullData));
      });
    });
  }

  ngOnInit(): void {
    this.emprendimientoService.fetchEmprendimientos();
  }
}
