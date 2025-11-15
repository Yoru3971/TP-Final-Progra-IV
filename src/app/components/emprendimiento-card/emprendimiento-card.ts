import { Component, Input } from '@angular/core';
import { EmprendimientoConViandas } from '../../model/emprendimiento-con-viandas.model';
import { ViandaCard } from '../vianda-card/vianda-card';


@Component({
  selector: 'app-emprendimiento-card',
  imports: [ViandaCard],
  templateUrl: './emprendimiento-card.html',
  styleUrl: './emprendimiento-card.css',
})
export class EmprendimientoCard {

  @Input() emprendimiento!: EmprendimientoConViandas;

  //REVISAR Solo muestra las primeras 4 viandas, aca va la logica del slider
  get primerasViandas() {
    return this.emprendimiento?.viandas?.slice(0, 4) ?? [];
  }
}
