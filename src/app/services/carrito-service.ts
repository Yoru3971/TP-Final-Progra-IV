import { inject, Injectable, signal } from '@angular/core';
import { EmprendimientoResponse } from '../model/emprendimiento-response.model';
import { ViandaCantidadCarrito } from '../model/vianda-cantidad-carrito.model';
import { ViandaResponse } from '../model/vianda-response.model';
import { ViandaService } from './vianda-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarData } from '../model/snackbar-data.model';
import { Snackbar } from '../shared/components/snackbar/snackbar';
import { firstValueFrom } from 'rxjs';
import { PedidoRequest } from '../model/pedido-request.model';
import { AuthService } from './auth-service';
import { ViandaCantidadRequest } from '../model/vianda-cantidad-request.model';
import { PedidosService } from './pedido-service';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { CarritoNuevoModal } from '../components/carrito-nuevo-modal/carrito-nuevo-modal';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private pedidoService = inject(PedidosService);
  private viandaService = inject(ViandaService);
  private snackBar = inject(MatSnackBar);

  private _fechaEntrega = signal<string>("");
  public fechaEntrega = this._fechaEntrega.asReadonly();

  private _emprendimiento = signal<EmprendimientoResponse|null>(null);
  public emprendimiento = this._emprendimiento.asReadonly();

  private _viandaCantidades = signal<ViandaCantidadCarrito[]>([]);
  public viandaCantidades = this._viandaCantidades.asReadonly();

  public constructor() {
    this.cargarDeLocalStorage();
  }

  public async agregarVianda(vianda: ViandaResponse): Promise<void> {
    if (!this._emprendimiento())
    {
      this._emprendimiento.set(vianda.emprendimiento);
      this.guardarEmprendimientoEnLocalStorage();
    }
    else if (vianda.emprendimiento.id !== this._emprendimiento()?.id) {
      const dialogRef = this.abrirModalConfirmacion(CarritoNuevoModal);
      const confirmado = await firstValueFrom(dialogRef.afterClosed());

      if (confirmado) {
        this.vaciar(true);
      }
      else return;
    }

    const indiceViandaCantidad =
      this._viandaCantidades()
        .findIndex((viandaCantidad) => viandaCantidad.vianda.id === vianda.id);

    if (indiceViandaCantidad >= 0) {
      this._viandaCantidades.update(arr => {
        arr[indiceViandaCantidad].cantidad++;
        return arr;
      });
    }
    else {
      this._viandaCantidades.update(arr =>
        [...arr, { vianda: vianda, cantidad: 1 } as ViandaCantidadCarrito]
      );
    }

    this.guardarViandasEnLocalStorage();
  }

  public quitarVianda(vianda: ViandaResponse): void {
    const indiceViandaCantidad =
      this._viandaCantidades()
        .findIndex((viandaCantidad) => viandaCantidad.vianda.id === vianda.id);

    if (indiceViandaCantidad < 0) return;

    this._viandaCantidades.update(arr => {
      const viandaCantidad = arr[indiceViandaCantidad];

      if (viandaCantidad.cantidad > 0) {
        viandaCantidad.cantidad--;
      }

      return arr;
    });

    this.guardarViandasEnLocalStorage();
  }

  public eliminarViandasEnCero() {
    this._viandaCantidades.update(
      arr => arr.filter(
        (viandaCantidad) => viandaCantidad.cantidad > 0
      )
    );

    if (!this._viandaCantidades().length) {
      this.vaciarViandasYEmprendimiento();
    }
  }

  // Devuelve `true` si se quitaron viandas del carrito, o si ocurre algún otro error
  public async revisarViandas() {
    if (!this.emprendimiento()) return true;

    const viandasEmprendimiento = await firstValueFrom(
      this.viandaService.getViandasByEmprendimientoId(this.emprendimiento()!.id)
    );

    let seQuitaronViandas = false;

    this._viandaCantidades.update(
      (arr) => arr.filter(
        (viandaCantidad) => {
          const vianda = viandasEmprendimiento.find((_vianda) => _vianda.id === viandaCantidad.vianda.id);

          if (!vianda || !vianda.estaDisponible) {
            seQuitaronViandas = true;
            return false;
          }

          return true;
        }
      )
    );

    if (seQuitaronViandas) {
      this.abrirSnackBar("Se eliminaron viandas no disponibles del carrito.");
    }

    return seQuitaronViandas;
  }

  public crearPedido() {
    this.eliminarViandasEnCero();

    const viandaCantidades = this.viandaCantidades();

    const pedido: PedidoRequest = {
      fechaEntrega: this.fechaEntrega(),
      clienteId: this.authService.usuarioId()!,
      emprendimientoId: viandaCantidades[0].vianda.emprendimiento.id,
      viandas: viandaCantidades.map(
        (viandaCantidad) => {
          return {
            viandaId: viandaCantidad.vianda.id,
            cantidad: viandaCantidad.cantidad
          } as ViandaCantidadRequest;
        }
      )
    };

    this.pedidoService.createPedido(pedido);
    this.abrirSnackBar("Pedido confirmado.");
    this.vaciar(false);
  }

  public setFechaEntrega(fecha: string) {
    this._fechaEntrega.set(fecha);
    this.guardarFechaEnLocalStorage();
  }

  public vaciar(anunciar: boolean) {
    this._fechaEntrega.set("");
    this.vaciarViandasYEmprendimiento();

    this.guardarEnLocalStorage();

    if (anunciar) {
      this.abrirSnackBar("Carrito vaciado.");
    }
  }

  public vaciarViandasYEmprendimiento() {
    this._emprendimiento.set(null);
    this._viandaCantidades.set([]);
  }

  public vacio() {
    return !this._viandaCantidades().length;
  }

  public abrirModalConfirmacion<T>(componente: ComponentType<T>) {
    return this.dialog.open(
      componente,
      {
        disableClose: true,
        width: "40rem"
      }
    );
  }

  private abrirSnackBar(mensaje: string) {
    const snackbarData: SnackbarData = {
      message: mensaje,
      iconName: "check_circle"
    }

    this.snackBar.openFromComponent(
      Snackbar,
      {
        duration: 4000,
        verticalPosition: "bottom",
        panelClass: "snackbar-panel",
        data: snackbarData
      }
    );
  }

  // Local Storage ============================================================

  private itemFechaName: string = "carrito-fecha_entrega";
  private itemEmprendimientoName: string = "carrito-emprendimiento";
  private itemViandasName: string = "carrito-viandas";

  private cargarDeLocalStorage() {
    const itemFecha = localStorage.getItem(this.itemFechaName);

    if (itemFecha) {
        this._fechaEntrega.set(JSON.parse(itemFecha));
    }

    const itemEmprendimientoName = localStorage.getItem(this.itemEmprendimientoName);

    if (itemEmprendimientoName) {
        this._emprendimiento.set(JSON.parse(itemEmprendimientoName));
    }

    const itemViandas = localStorage.getItem(this.itemViandasName);

    if (itemViandas) {
        this._viandaCantidades.set(
          JSON.parse(itemViandas).map(
              (vianda: ViandaCantidadCarrito) => vianda
          )
        );
    }
  }

  private guardarFechaEnLocalStorage() {
    localStorage.setItem(this.itemFechaName, JSON.stringify(this._fechaEntrega()));
  }

  private guardarEmprendimientoEnLocalStorage() {
    localStorage.setItem(this.itemEmprendimientoName, JSON.stringify(this._emprendimiento()));
  }

  private guardarViandasEnLocalStorage() {
    localStorage.setItem(this.itemViandasName, JSON.stringify(this._viandaCantidades()));
  }

  private guardarEnLocalStorage() {
    this.guardarFechaEnLocalStorage();
    this.guardarViandasEnLocalStorage();
  }
}
