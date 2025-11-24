import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito-service';
import { MatDialogRef } from '@angular/material/dialog';
import { ViandaResponse } from '../../model/vianda-response.model';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ConfirmarModalService } from '../../services/confirmar-modal-service';

@Component({
  selector: 'app-carrito-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './carrito-modal.html',
  styleUrl: './carrito-modal.css',
})
export class CarritoModal implements OnInit {
  private carritoService = inject(CarritoService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private confirmarModalService = inject(ConfirmarModalService);
  private dialogRef = inject(MatDialogRef<CarritoModal>);
  private formBuilder = inject(FormBuilder);

  public emprendimiento = this.carritoService.emprendimiento;
  public viandaCantidades = this.carritoService.viandaCantidades;

  public modalBloqueado = false;

  private validadorFecha = (control: AbstractControl): ValidationErrors | null => {
    const fechaIngresadaControl: string = control.value;

    if (!fechaIngresadaControl) return { invalidValue: true };

    // Para solucionar un problema de zona horaria
    const [y, m, d] = fechaIngresadaControl.split('-').map(Number);

    const fechaIngresada = new Date(y, m - 1, d),
      fechaHoy = new Date();

    fechaIngresada.setHours(0, 0, 0, 0);
    fechaHoy.setHours(0, 0, 0, 0);

    return fechaIngresada < fechaHoy ? { invalidValue: true } : null;
  };

  formFecha = this.formBuilder.nonNullable.group({
    fechaEntrega: ['', [Validators.required, this.validadorFecha]],
  });

  ngOnInit(): void {
    this.formFecha.patchValue({
      fechaEntrega: this.carritoService.fechaEntrega(),
    });

    this.formFecha.valueChanges.subscribe((value) => {
      if (this.formFecha.valid) {
        this.carritoService.setFechaEntrega(value.fechaEntrega!);
      }
    });
  }

  public sumarVianda(vianda: ViandaResponse) {
    this.carritoService.agregarVianda(vianda);
  }

  public restarVianda(vianda: ViandaResponse) {
    this.carritoService.quitarVianda(vianda);
  }

  public cantidadViandaEnMinimo(vianda: ViandaResponse) {
    return this.carritoService.cantidadViandaEnMinimo(vianda);
  }

  public cantidadViandaEnMaximo(vianda: ViandaResponse) {
    return this.carritoService.cantidadViandaEnMaximo(vianda);
  }

  public vacio() {
    return this.carritoService.vacio();
  }

  public get total() {
    return this.viandaCantidades().reduce(
      (total, viandaCantidad) => (total += viandaCantidad.vianda.precio * viandaCantidad.cantidad),
      0
    );
  }

  public async cancelarPedido() {
    this.modalBloqueado = true;

    let texto = '¿Seguro de que querés cancelar el pedido?';

    if (!this.carritoService.vacio()) {
      texto = texto.concat(' El carrito se va a vaciar.');
    }

    const confirmado = await firstValueFrom(
      this.confirmarModalService.confirmar({
        titulo: 'Cancelar Pedido',
        texto: texto,
      })
    );

    setTimeout(() => {
      if (confirmado) {
        this.carritoService.vaciar(true);
        this.cerrar();
      }

      this.modalBloqueado = false;

      this.changeDetectorRef.detectChanges();
    }, 0);
  }

  public async confirmarPedido() {
    this.modalBloqueado = true;

    if (this.formFecha.valid) {
      const errorRevision = await this.carritoService.revisarViandas();

      if (!errorRevision) {
        this.carritoService.eliminarViandasEnCero();

        const confirmado = await firstValueFrom(
          this.confirmarModalService.confirmar({
            titulo: 'Confirmar Pedido',
            texto: '¿Seguro de que querés confirmar el pedido?',
          })
        );

        setTimeout(() => {
          if (confirmado) {
            this.carritoService.crearPedido();
            this.cerrar();
          }

          this.modalBloqueado = false;

          this.changeDetectorRef.detectChanges();
        }, 0);

        return;
      }
    } else {
      this.formFecha.markAllAsDirty();
      this.formFecha.markAllAsTouched();
    }

    this.modalBloqueado = false;
  }

  public cerrar() {
    this.dialogRef.close();
  }
}
