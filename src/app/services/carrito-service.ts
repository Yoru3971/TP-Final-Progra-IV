import { computed, inject, Injectable, signal } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { CarritoModal } from '../components/carrito-modal/carrito-modal';
import { CarritoConfirmarModalData } from '../model/carrito-confirmar-modal-data.model';
import { CarritoConfirmarModal } from '../components/carrito-confirmar-modal/carrito-confirmar-modal';

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

  // Modificación de datos ====================================================

  public async abrirCarrito(emprendimiento: EmprendimientoResponse) {
    if (this._emprendimiento()) {
      if (this._emprendimiento()!.id !== emprendimiento.id) {
        const dialogRef = this.abrirModalConfirmacion({
          titulo: "Nuevo Carrito",
          texto:
            "El carrito actual corresponde a otro emprendimiento, " +
            "¿querés vaciar el carrito y empezar desde cero?"
        });

        const confirmado = await firstValueFrom(dialogRef.afterClosed());

        if (confirmado) {
          this.vaciar(true);
          this._emprendimiento.set(emprendimiento);
        }
        else return;
      }
    }
    else {
      this._emprendimiento.set(emprendimiento);
    }

    this.abrirModalCarrito();
  }

  public async agregarVianda(vianda: ViandaResponse): Promise<void> {
    if (!this._emprendimiento())
    {
      this._emprendimiento.set(vianda.emprendimiento);
      this.guardarEmprendimientoEnLocalStorage();
    }
    else if (vianda.emprendimiento.id !== this._emprendimiento()?.id) {
      const dialogRef = this.abrirModalConfirmacion({
        titulo: "Nuevo Carrito",
        texto:
            "El carrito actual contiene viandas de un emprendimiento distinto al de la vianda que querés agregar, " +
            "¿querés vaciar el carrito y empezar desde cero?"
      });

      const confirmado = await firstValueFrom(dialogRef.afterClosed());

      if (confirmado) {
        this.vaciar(true);
        this._emprendimiento.set(vianda.emprendimiento);
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
    const indiceViandaCantidad = this.encontrarIndiceVianda(vianda.id);

    if (indiceViandaCantidad < 0) return;

    let quitada = false;

    this._viandaCantidades.update(arr => {
      const viandaCantidad = arr[indiceViandaCantidad];

      if (viandaCantidad.cantidad > 0) {
        quitada = true;
        viandaCantidad.cantidad--;
      }

      return arr;
    });

    if (quitada) {
      this.guardarViandasEnLocalStorage();
    }
  }

  public eliminarViandasEnCero() {
    this._viandaCantidades.update(
      arr => arr.filter(
        (viandaCantidad) => viandaCantidad.cantidad > 0
      )
    );
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

  public setFechaEntrega(fecha: string) {
    this._fechaEntrega.set(fecha);
    this.guardarFechaEnLocalStorage();
  }

  // Consulta de datos ========================================================

  public cantidadViandaEnCarrito(idVianda: number) {
    return computed(() => {
      if (this.noEsCliente())
        return 0;

      const indiceVianda = this.encontrarIndiceVianda(idVianda);

      return (indiceVianda >= 0) ? this.viandaCantidades()[indiceVianda].cantidad : 0;
    });
  }

  private encontrarIndiceVianda(idVianda: number): number {
    return this._viandaCantidades().findIndex((viandaCantidad) => viandaCantidad.vianda.id === idVianda);
  }

  public vacio() {
    return !this._viandaCantidades().length;
  }

  private noEsCliente() {
    return this.authService.currentUserRole() !== "CLIENTE";
  }

  // Pedidos ==================================================================

  public crearPedido() {
    this.eliminarViandasEnCero();

    const pedido: PedidoRequest = {
      fechaEntrega: this.fechaEntrega()!,
      clienteId: this.authService.usuarioId()!,
      emprendimientoId: this.emprendimiento()!.id,
      viandas: this.viandaCantidades().map(
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

  // Modales ==================================================================

  private abrirModalCarrito() {
      this.dialog.open(
        CarritoModal,
        {
          maxHeight: "90vh",
          maxWidth: "90rem",
          width: "90rem"
        }
      );
  }

  public abrirModalConfirmacion(data: CarritoConfirmarModalData) {
    return this.dialog.open(
      CarritoConfirmarModal,
      {
        data: data,
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
