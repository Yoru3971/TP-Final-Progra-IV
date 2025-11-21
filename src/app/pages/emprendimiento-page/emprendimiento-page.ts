import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { ViandaService } from '../../services/vianda-service';
import { EmprendimientoInfo } from '../../components/emprendimiento-info/emprendimiento-info';
import { ViandaCardDetallada } from '../../components/vianda-card-detallada/vianda-card-detallada';
import { EmprendimientoFiltrosViandas } from '../../components/emprendimiento-filtros-viandas/emprendimiento-filtros-viandas';
import { FiltrosViandas } from '../../model/filtros-viandas.model';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { ViandaResponse } from '../../model/vianda-response.model';
import { MatDialog } from '@angular/material/dialog';
import { FormVianda } from '../../components/form-vianda/form-vianda';

@Component({
  selector: 'app-emprendimiento-page',
  imports: [EmprendimientoInfo, EmprendimientoFiltrosViandas, ViandaCardDetallada],
  templateUrl: './emprendimiento-page.html',
  styleUrl: './emprendimiento-page.css',
})
export class EmprendimientoPage {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private emprendimientoService = inject(EmprendimientoService);
  private viandaService = inject(ViandaService);
  private routeParams = toSignal(this.route.paramMap);
  private dialog = inject(MatDialog);

  //  Uso signals para idEmprendimiento, emprendimiento y esDueno (si algo cambia, se actualiza todo automáticamente)
  idEmprendimiento = computed(() => {
    const id = this.routeParams()?.get('id');
    return id ? Number(id) : null;
  });

  emprendimiento = toSignal(
    toObservable(this.idEmprendimiento).pipe(
      switchMap((id) => {
        if (!id) return of(null);
        return this.emprendimientoService.getEmprendimientoById(id).pipe(
          catchError((err) => {
            console.error('Error cargando emprendimiento', err);
            return of(null);
          })
        );
      })
    )
  );

  esDueno = computed(() => {
    // cambia el comportamiento de los componentes (según si es dueño o cliente)
    const emp = this.emprendimiento();
    const userId = this.authService.usuarioId();
    const userRole = this.authService.currentUserRole();

    if (emp && userRole === 'DUENO' && emp.dueno.id === userId) {
      return true;
    }
    return false;
  });

  private esDuenoAjeno = computed(() => {
    const emp = this.emprendimiento();
    const userRole = this.authService.currentUserRole();

    // Si todavía no cargó el emprendimiento, no puedo saber si es dueño ajeno (esto evita falsos positivos)
    if (!emp) return false;

    // Es dueño PERO no es el dueño de este local
    return userRole === 'DUENO' && !this.esDueno(); //  AGREGAR page de error 403 si intenta acceder siendo dueño ajeno (no sé donde va)
  });

  //  Signal que contiene los filtros actuales
  filtrosSignal = signal<FiltrosViandas>({} as FiltrosViandas);

  // Uso un computed para agrupar todas las cosas que "disparan" una recarga
  private triggerViandas = computed(() => {
    return {
      id: this.idEmprendimiento(),
      filtros: this.filtrosSignal(),
      esDueno: this.esDueno(),
      esDuenoAjeno: this.esDuenoAjeno(),
      emp: this.emprendimiento(),
    };
  });

  // Convierto el trigger en un Observable (llama a la API y devuelve las viandas que muestro en pantalla)
  viandas = toSignal(
    toObservable(this.triggerViandas).pipe(
      switchMap(({ id, filtros, esDueno, esDuenoAjeno, emp }) => {
        if (!id || !emp) return of([] as ViandaResponse[]);

        if (esDuenoAjeno) {
          console.warn('Bloqueando carga de viandas: Usuario es dueño de otro local.');
          return of([] as ViandaResponse[]);
        }

        let request$: Observable<ViandaResponse[]>;
        if (esDueno) {
          request$ = this.viandaService.getViandasDueno(id, filtros);
        } else {
          request$ = this.viandaService.getViandasCliente(id, filtros);
        }

        return request$.pipe(
          catchError((err) => {
            console.error('Error cargando viandas (posiblemente sin resultados)', err);
            return of([] as ViandaResponse[]);
          })
        );
      })
    ),
    { initialValue: [] as ViandaResponse[] }
  );

  private triggerViandasTotales = computed(() => {
    return {
      id: this.idEmprendimiento(),
      esDueno: this.esDueno(),
      esDuenoAjeno: this.esDuenoAjeno(),
      emp: this.emprendimiento(),
    };
  });

  //  Uso viandasTotales para tener las categorías disponibles en los filtros
  //  (Lo necesito porque las categorías se obtienen dinámicamente)
  viandasTotales = toSignal(
    toObservable(this.triggerViandasTotales).pipe(
      switchMap(({ id, esDueno, esDuenoAjeno, emp }) => {
        if (!id || !emp) return of([] as ViandaResponse[]);

        if (esDuenoAjeno) {
          return of([] as ViandaResponse[]);
        }

        let request$: Observable<ViandaResponse[]>;

        if (esDueno) {
          request$ = this.viandaService.getViandasDueno(id);
        } else {
          request$ = this.viandaService.getViandasCliente(id);
        }

        return request$.pipe(catchError(() => of([] as ViandaResponse[])));
      })
    ),
    { initialValue: [] as ViandaResponse[] }
  );

  //  -------------------  Componente: emprendimiento-info -------------------
  abrirModalEditarEmprendimiento() {
    console.log('Abre modal de edición'); //  AGREGAR abrir modal de edición del emprendimiento
  }

  abrirModalCarrito() {
    console.log('Abre carrito'); //  AGREGAR abrir modal carrito
  }

  //  -------------------  Componente: emprendimiento-filtros-viandas -------------------
  onFiltrosChanged(nuevosFiltros: FiltrosViandas) {
    this.filtrosSignal.set(nuevosFiltros);
  }

  openViandaForm() {
    this.dialog
      .open(FormVianda, {
        width: '100rem',
        panelClass: 'form-modal',
        autoFocus: false,
        restoreFocus: false,
      })
      .afterClosed()
      .subscribe((exito) => {
        if (exito) {
          // ACA VA LA LINEA PARA ACTUALIZAR LAS VIANDAS DE LA VISTA
        }
      });
  }
}
