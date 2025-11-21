import { Component, inject, effect, signal, OnInit } from '@angular/core';
import { EmprendimientoService } from '../../services/emprendimiento-service';
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

  emprendimientos = signal<EmprendimientoConViandas[]>([]);

  constructor() {
    effect(() => {
      const emps = this.emprendimientoService.emprendimientos();

      this.emprendimientos.set([]);

      if (emps.length === 0) return;

      this.emprendimientoService
        .loadEmprendimientosConViandas()
        .subscribe((fullData) => this.emprendimientos.set(fullData));
    });
  }

  ngOnInit() {
    this.emprendimientoService.fetchEmprendimientos();
  }
}
