import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FiltrosViandas } from '../../../model/filtros-viandas.model';
import { ViandaResponse } from '../../../model/vianda-response.model';
import { FormsModule } from '@angular/forms';
import { IconTacc } from '../../utils/icon-tacc/icon-tacc';
import { IconVeggie } from '../../utils/icon-veggie/icon-veggie';
import { IconVegan } from '../../utils/icon-vegan/icon-vegan';
import { PageMode } from '../../../pages/emprendimiento-page/emprendimiento-page';

type FiltroDisponibilidad = 'TODAS' | 'DISPONIBLES' | 'NO_DISPONIBLES';

@Component({
  selector: 'app-emprendimiento-filtros-viandas',
  imports: [FormsModule, IconTacc, IconVegan, IconVeggie],
  templateUrl: './emprendimiento-filtros-viandas.html',
  styleUrl: './emprendimiento-filtros-viandas.css',
})
export class EmprendimientoFiltrosViandas {
  viandasIniciales = input.required<ViandaResponse[]>();
  modo = input.required<PageMode>();

  filtrosChanged = output<FiltrosViandas>();

  categoriaSeleccionada = signal<string | null>(null);
  busqueda = signal<string>('');
  esVegano = signal<boolean>(false);
  esVegetariano = signal<boolean>(false);
  esSinTacc = signal<boolean>(false);
  precioMin = signal<number | null>(null);
  precioMax = signal<number | null>(null);

  filtroDisponibilidad = signal<FiltroDisponibilidad>('TODAS');

  // Extrae dinámicamente las categorías de las viandas que llegan
  categoriasDisponibles = computed(() => {
    const viandas = this.viandasIniciales();
    if (!viandas || viandas.length === 0) return [];

    const categorias = viandas.map((v) => v.categoria);
    return [...new Set(categorias)]; // Uso Set para eliminar duplicados
  });

  // Leve retraso en la busqueda por nombre para evitar buscar al instante al tipear
  private debounceTimer: any;
  onSearchInput(texto: string) {
    this.busqueda.set(texto);

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.emitirFiltros();
    }, 500);
  }

  borrarBusqueda() {
    this.busqueda.set('');
    this.onSearchInput('');
  }

  setDisponibilidad(valor: FiltroDisponibilidad) {
    this.filtroDisponibilidad.set(valor);
    this.emitirFiltros();
  }

  emitirFiltros() {
    let disponibilidad: boolean | null = null;
    const estado = this.filtroDisponibilidad();
    
    if (estado === 'DISPONIBLES') disponibilidad = true;
    if (estado === 'NO_DISPONIBLES') disponibilidad = false;

    const dto: FiltrosViandas = {
      nombreVianda: this.busqueda(),
      categoria: this.categoriaSeleccionada(),
      esVegano: this.esVegano(),
      esVegetariano: this.esVegetariano(),
      esSinTacc: this.esSinTacc(),
      precioMin: this.precioMin(),
      precioMax: this.precioMax(),
      estaDisponible: disponibilidad,
    };

    this.filtrosChanged.emit(dto);
  }

  toggleCategoria(cat: string) {
    this.categoriaSeleccionada.update((current) => (current === cat ? null : cat));
    this.emitirFiltros();
  }

  toggleDietary(tipo: 'vegano' | 'vegetariano' | 'sintacc') {
    if (tipo === 'vegano') this.esVegano.update((v) => !v);
    if (tipo === 'vegetariano') this.esVegetariano.update((v) => !v);
    if (tipo === 'sintacc') this.esSinTacc.update((v) => !v);
    this.emitirFiltros();
  }

  // Leve retraso en la busqueda por precio (igual al de nombre)
  private precioDebounceTimer: any;
  updatePrecio(tipo: 'min' | 'max', valor: number | null) {
    if (tipo === 'min') this.precioMin.set(valor);
    if (tipo === 'max') this.precioMax.set(valor);

    clearTimeout(this.precioDebounceTimer);
    this.precioDebounceTimer = setTimeout(() => {
      this.emitirFiltros();
    }, 500);
  }
}
