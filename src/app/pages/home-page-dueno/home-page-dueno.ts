import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { EmprendimientoConViandas } from '../../model/emprendimiento-con-viandas.model';
import { EmprendimientoCard } from '../../components/emprendimiento-card/emprendimiento-card';

@Component({
  selector: 'app-home-page-dueno',
  imports: [EmprendimientoCard],
  templateUrl: './home-page-dueno.html',
  styleUrl: './home-page-dueno.css',
})
export class HomePageDueno implements OnInit {
  private emprendimientoService = inject(EmprendimientoService);

  emprendimientos = signal<EmprendimientoConViandas[]>([]);

  constructor() {
    effect(() => {
      const emps = this.emprendimientoService.emprendimientos();

      if (emps.length === 0) {
        this.emprendimientos.set([]);
        return;
      }

      this.emprendimientoService
        .loadEmprendimientosConViandas()
        .subscribe(full => this.emprendimientos.set(full));
    });
  }

  ngOnInit() {
    this.emprendimientoService.fetchEmprendimientos();
  }
}