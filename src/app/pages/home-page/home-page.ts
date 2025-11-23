import { Component, inject, effect, signal, OnInit, computed } from '@angular/core';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { EmprendimientoCard } from '../../components/emprendimiento-card/emprendimiento-card';
import { EmprendimientoConViandas } from '../../model/emprendimiento-con-viandas.model';
import { CityFilterService } from '../../services/city-filter-service';

@Component({
  selector: 'app-home-page',
  imports: [EmprendimientoCard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  private emprendimientoService = inject(EmprendimientoService);
  private cityFilter = inject(CityFilterService);
  ciudadActual = computed(() => (this.cityFilter.city() ?? '').toUpperCase());

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
