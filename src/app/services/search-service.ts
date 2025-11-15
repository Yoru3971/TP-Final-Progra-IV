import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, effect } from '@angular/core';
import { catchError, debounceTime, of, Subject, switchMap } from 'rxjs';
import { CityFilterService } from './city-filter-service';
import { EmprendimientoResponse } from '../model/emprendimiento-response.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  termino = signal(''); //lo que escribe el usuario en el buscador
  mensaje = signal(''); // mensaje "no encontrado" ///REVISAR no esta andando
  loading = signal(false); // indica si la busqueda esta en curso
  resultados = signal<EmprendimientoResponse[]>([]); // contiene los emprendimientos filtrados y limitas a 6 //REVISAR, puse 6 para no traer todos, capaz una paginacion? o scroll?

  private http = inject(HttpClient);
  private cityFilter = inject(CityFilterService);

  // donde recibo los parametros de busqueda, nos permite llamar al back al presionar cada tecla
  private termino$ = new Subject<string>();

  constructor() {
    // Pipeline reactivo con debounce de 300ms
    this.termino$
      .pipe(
        debounceTime(300), //espera 300 desde el ultimo cambio antes de ejecutar la busqueda
        switchMap((term) => { //cada termino cancela la busqueda anterior
          const ciudad = this.cityFilter.city() ?? ''; //que no sea undefined nunca

          if (!term.trim()) { //si esta vacio el termino, limpia resultado y msj
            this.resultados.set([]);
            this.mensaje.set('');
            return of([]);
          }

          this.loading.set(true); //avisa que esta cargando mientras llega la respuesta

          return this.http
            .get<EmprendimientoResponse[]>(`http://localhost:8080/api/public/emprendimientos/nombre/${term}`)
            .pipe(
              catchError(() => { //si no encuentra nada, devuelve un arreglo vacio y desactiva loading
                this.loading.set(false);
                return of([]);
              }),
              switchMap((data) => {
                //filtro por ciudad lo que traje por nombre
                const filtrado = data.filter(e => e.ciudad?.toUpperCase() === ciudad.toUpperCase());
                this.resultados.set(filtrado.slice(0, 6)); //limito a mostrar solo 6
                this.loading.set(false);

                this.mensaje.set( //actualizo el mensaje si no encuentra nada
                  filtrado.length === 0 && term.trim() !== ''
                    ? 'No se encontraron emprendimientos con este nombre.'
                    : ''
                );
                return of(filtrado);
              })
            );
        })
      )
      .subscribe();

    // Reactivo a cambios de ciudad
    effect(() => {
      // Reejecutar la búsqueda actual si cambia la ciudad
      const ciudad = this.cityFilter.city();
      const term = this.termino();
      if (term.trim()) {
        this.buscar(term);
      }
    });
  }

  // Método público para buscar
  buscar(valor: string) {
    this.termino.set(valor);
    this.termino$.next(valor); 
  }
}
