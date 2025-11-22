import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ViandaResponse } from '../../model/vianda-response.model';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CarritoConfirmarModal } from '../carrito-confirmar-modal/carrito-confirmar-modal';
import { CarritoCancelarModal } from '../carrito-cancelar-modal/carrito-cancelar-modal';
import { firstValueFrom } from 'rxjs';
import { ComponentType } from '@angular/cdk/overlay';

@Component({
  selector: 'app-carrito-modal',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './carrito-modal.html',
  styleUrl: './carrito-modal.css',
})
export class CarritoModal implements OnInit {
  private carritoService = inject(CarritoService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private dialogRef = inject(MatDialogRef<CarritoModal>);
  private formBuilder = inject(FormBuilder);

  public emprendimiento = this.carritoService.emprendimiento;
  public viandaCantidades = this.carritoService.viandaCantidades;

  public modalBloqueado = false;

  private validadorFecha = (control: AbstractControl): ValidationErrors|null => {
    const fechaIngresadaControl: string = control.value;

    if (!fechaIngresadaControl) return { invalidValue: true };

    // Para solucionar un problema de zona horaria
    const [y,m,d] = fechaIngresadaControl.split('-').map(Number);

    const fechaIngresada = new Date(y, m-1, d),
          fechaHoy = new Date();

    fechaIngresada.setHours(0,0,0,0);
    fechaHoy.setHours(0,0,0,0);

    return (fechaIngresada < fechaHoy) ? { invalidValue: true } : null;
  }

  formFecha = this.formBuilder.nonNullable.group({
    fechaEntrega: ["", [Validators.required, this.validadorFecha]]
  });

  ngOnInit(): void {
    this.formFecha.patchValue({
      fechaEntrega: this.carritoService.fechaEntrega()
    });

    this.formFecha.valueChanges.subscribe(
      (value) => {
        if (this.formFecha.valid) {
          this.carritoService.setFechaEntrega(value.fechaEntrega!);
        }
      }
    );

    this.carritoService.eliminarViandasEnCero();
  }

  public sumarVianda(vianda: ViandaResponse) {
    this.carritoService.agregarVianda(vianda);
  }

  public restarVianda(vianda: ViandaResponse) {
    this.carritoService.quitarVianda(vianda);
  }

  public vacio() {
    return this.carritoService.vacio();
  }

  public get total() {
    return this.viandaCantidades().reduce(
        (total, viandaCantidad) => total += viandaCantidad.vianda.precio * viandaCantidad.cantidad,
        0
    );
  }

  public async cancelarPedido() {
    this.modalBloqueado = true;
    
    const confirmado = await firstValueFrom(
      this.confirmar(CarritoCancelarModal)
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
        const confirmado = await firstValueFrom(
          this.confirmar(CarritoConfirmarModal)
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
    }
    else {
      this.formFecha.markAllAsDirty();
      this.formFecha.markAllAsTouched();
    }

    this.modalBloqueado = false;
  }

  private confirmar<T>(componente: ComponentType<T>) {
    return this.carritoService.abrirModalConfirmacion(componente).afterClosed();
  }

  public cerrar() {
    this.dialogRef.close();
  }
}
