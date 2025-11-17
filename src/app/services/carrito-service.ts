import { Injectable, signal } from '@angular/core';
import { EmprendimientoResponse } from '../model/emprendimiento-response.model';
import { ViandaCantidad } from '../model/vianda-cantidad.model';
import { ViandaResponse } from '../model/vianda-response.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  #emprendimiento = signal<EmprendimientoResponse|null>(null);
  emprendimiento = this.#emprendimiento.asReadonly();

  #viandaCantidades = signal<ViandaCantidad[]>([]);
  viandaCantidades = this.#viandaCantidades.asReadonly();

  constructor() {
    this.#cargarDeLocalStorage();
  }

  agregarVianda(vianda: ViandaResponse): void {
    if (!this.#emprendimiento())
    {
      this.#emprendimiento.set(vianda.emprendimiento);
    }
    else if (vianda.emprendimiento !== this.#emprendimiento()) {
      if (confirm(
        "El carrito contiene viandas de un emprendimiento distinto al de la vianda que intentas agregar, " +
        "¿querés vaciar el carrito y empezar desde cero?"
      )) {
        this.#emprendimiento.set(vianda.emprendimiento);
        this.#viandaCantidades.set([]);
      }
      else {
        return;
      }
    }

    const indiceViandaCantidad =
      this.#viandaCantidades()
        .findIndex((viandaCantidad) => viandaCantidad.vianda === vianda);

    if (indiceViandaCantidad >= 0) {
      this.#viandaCantidades.update(arr => {
        arr[indiceViandaCantidad].cantidad++;

        return arr;
      });
    }
    else {
      this.#viandaCantidades.update(arr =>
        [...arr, { vianda: vianda, cantidad: 1 } as ViandaCantidad]
      );
    }

    this.#guardarEnLocalStorage();
  }

  quitarVianda(vianda: ViandaResponse): void {
    const indiceViandaCantidad =
      this.#viandaCantidades()
        .findIndex((viandaCantidad) => viandaCantidad.vianda === vianda);

    if (indiceViandaCantidad < 0) return;

    this.#viandaCantidades.update(arr => {
      arr[indiceViandaCantidad].cantidad--;

      if (arr[indiceViandaCantidad].cantidad <= 0) {
        arr.splice(indiceViandaCantidad, 1);

        if (!arr.length) {
          this.vaciar();
        }
      }

      return arr;
    });

    this.#guardarEnLocalStorage();
  }

  vaciar() {
    this.#emprendimiento.set(null);
    this.#viandaCantidades.set([]);
    this.#guardarEnLocalStorage();
  }

  vacio() {
    return !this.#viandaCantidades().length;
  }

  #itemName: string = "carrito-viandas";

  #cargarDeLocalStorage() {
    const item = localStorage.getItem(this.#itemName);

    if (item) {
        this.#viandaCantidades.set(
          JSON.parse(item).map(
              (vianda: ViandaCantidad) => vianda
          )
        );
    }
  }

  #guardarEnLocalStorage() {
    localStorage.setItem(this.#itemName, JSON.stringify(this.#viandaCantidades()));
  }
}
