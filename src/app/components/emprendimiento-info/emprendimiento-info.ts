import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  output,
  Output,
  signal,
} from '@angular/core';
import { EmprendimientoResponse } from '../../model/emprendimiento-response.model';
import { MatDialog } from '@angular/material/dialog';
import { FormUpdateEmprendimiento } from '../form-emprendimiento-update/form-emprendimiento-update';
import { EmprendimientoService } from '../../services/emprendimiento-service';

@Component({
  selector: 'app-emprendimiento-info',
  imports: [],
  templateUrl: './emprendimiento-info.html',
  styleUrl: './emprendimiento-info.css',
})
export class EmprendimientoInfo {
  private emprendimientoService = inject(EmprendimientoService);

  @Input() datos!: EmprendimientoResponse;
  public emprendimientoSignal = signal<EmprendimientoResponse | null>(null);

  ngOnInit(): void {
    if (this.datos) {
      this.emprendimientoSignal.set(this.datos);
    }
  }

  modo = input.required<'CLIENTE' | 'DUENO' | 'INVITADO' | 'PROHIBIDO' | 'CARGANDO'>();

  private dialog = inject(MatDialog);

  accionPrincipal = output<void>();

  onButtonClick() {
    this.accionPrincipal.emit();
  }

  openEmprendimientoForm() {
    this.dialog
      .open(FormUpdateEmprendimiento, {
        width: '100rem',
        panelClass: 'form-modal',
        autoFocus: false,
        restoreFocus: false,
        data: this.datos
      })
      .afterClosed()
      .subscribe((exito) => {
        if (exito) {
          this.emprendimientoService.fetchEmprendimientos();
        }
      });
  }
}
