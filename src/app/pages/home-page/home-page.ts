import { Component, inject, effect, signal, OnInit, computed } from '@angular/core';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { EmprendimientoCard } from '../../components/cards/emprendimiento-card/emprendimiento-card';
import { EmprendimientoConViandas } from '../../model/emprendimiento-con-viandas.model';
import { CityFilterService } from '../../services/city-filter-service';
import { EmprendimientoResponse } from '../../model/emprendimiento-response.model';

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

  emprendimientos = signal<EmprendimientoResponse[]>([]);

  pageInfo = computed(() => this.emprendimientoService.pageInfo());

  constructor() {
    //  Cargo las viandas
    effect(() => {
      const emps = this.emprendimientoService.emprendimientos();

      this.emprendimientos.set(emps);

      if (emps.length === 0) return;

      this.emprendimientoService
        .loadEmprendimientosConViandas()
        .subscribe((fullData) => this.emprendimientos.set(fullData));
    });

    //  Vuelvo a la página 0 si cambio de ciudad
    effect(() => {
        const ciudad = this.cityFilter.city(); 
        this.emprendimientoService.fetchEmprendimientos(0, 10);
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    
  }

  onPageChange(newPage: number) {
      this.emprendimientoService.fetchEmprendimientos(newPage, 10);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
