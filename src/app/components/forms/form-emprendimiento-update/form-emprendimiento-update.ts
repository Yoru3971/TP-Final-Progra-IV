import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ErrorDialogModal } from '../../modals/error-dialog-modal/error-dialog-modal';
import { Snackbar } from '../../modals/snackbar/snackbar';
import { SnackbarData } from '../../../model/snackbar-data.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmprendimientoService } from '../../../services/emprendimiento-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmprendimientoResponse } from '../../../model/emprendimiento-response.model';
import { firstValueFrom } from 'rxjs';
import { ConfirmarModalService } from '../../../services/confirmar-modal-service';
import { Router } from '@angular/router';
import { CitySelector } from '../../utils/city-selector/city-selector';

@Component({
  selector: 'app-form-emprendimiento-update',
  imports: [ReactiveFormsModule, CitySelector],
  templateUrl: './form-emprendimiento-update.html',
  styleUrl: './form-emprendimiento-update.css',
})
export class FormUpdateEmprendimiento {
  public emprendimiento: EmprendimientoResponse = inject(MAT_DIALOG_DATA);

  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<FormUpdateEmprendimiento>);
  private emprendimientoService = inject(EmprendimientoService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private confirmarModalService = inject(ConfirmarModalService);
  private router = inject(Router);

  selectedFileName: string | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  fileInputRef: any;

  maxWidth = 1920;
  maxHeight = 1080;
  newImageFile: File | null = null;

  formEmprendimiento = this.fb.group({
    nombreEmprendimiento: ['', [Validators.required, Validators.maxLength(255)]],
    ciudad: ['', [Validators.required]],
    direccion: ['', [Validators.maxLength(255)]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
    estaDisponible: [true, [Validators.required]]
  });

  ngOnInit() {
    this.formEmprendimiento.patchValue({
      nombreEmprendimiento: this.emprendimiento.nombreEmprendimiento,
      ciudad: this.emprendimiento.ciudad,
      direccion: this.emprendimiento.direccion,
      telefono: this.emprendimiento.telefono,
      estaDisponible: this.emprendimiento.estaDisponible
    });

    if (this.emprendimiento.imagenUrl) {
      this.imagePreviewUrl = this.emprendimiento.imagenUrl;
    }
  }

  onFileInputReady(element: HTMLInputElement) {
    this.fileInputRef = element;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.newImageFile = null;
      this.selectedFileName = null;
      this.imagePreviewUrl = this.emprendimiento.imagenUrl || null;
      this.cdr.detectChanges();
      return;
    }

    this.newImageFile = file;
    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = e.target.result;
      this.cdr.detectChanges();

      const img = new Image();
      img.onload = () => {
        if (img.width > this.maxWidth || img.height > this.maxHeight) {
          this.dialog.open(ErrorDialogModal, {
            data: {
              message: `La imagen no debe superar ${this.maxWidth}x${this.maxHeight}px`,
            },
            panelClass: 'modal-error',
          });

          this.newImageFile = null;
          this.selectedFileName = null;
          this.imagePreviewUrl = this.emprendimiento.imagenUrl || null;
        }

        this.cdr.detectChanges();
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  removeImage() {
    this.newImageFile = null;
    this.selectedFileName = null;
    this.imagePreviewUrl = null;

    if (this.fileInputRef) this.fileInputRef.value = '';

    this.cdr.detectChanges();
  }

  async onDelete() {
    const confirmado = await firstValueFrom(
      this.confirmarModalService.confirmar({
        titulo: 'Eliminar Emprendimiento',
        texto:
          '¿Seguro de que querés eliminar el emprendimiento? <span>Esta acción es irreversible.</span>',
        textoEsHtml: true,
        critico: true,
      })
    );

    if (!confirmado) return;

    this.emprendimientoService.deleteEmprendimiento(this.emprendimiento.id).subscribe({
      next: () => {
        this.deleteSuccess();
      },
      error: () => {
        this.showError(
          'Error al eliminar el emprendimiento. Es posible que tenga pedidos asociados.'
        );
      },
    });
  }

  private deleteSuccess() {
    const data: SnackbarData = {
      message: 'Emprendimiento eliminado con éxito.',
      iconName: 'check_circle',
    };

    this.snackBar.openFromComponent(Snackbar, {
      data,
      duration: 3000,
      panelClass: 'snackbar-panel',
      verticalPosition: 'bottom',
    });

    this.dialogRef.close(true);
    this.router.navigateByUrl('home');
  }

  onSubmit() {
    if (this.formEmprendimiento.invalid) return;

    const dto = this.formEmprendimiento.value;

    this.emprendimientoService.updateEmprendimiento(this.emprendimiento.id, dto).subscribe({
      next: () => {
        if (this.newImageFile) {
          const fd = new FormData();
          fd.append('image', this.newImageFile);

          this.emprendimientoService
            .updateImagenEmprendimiento(this.emprendimiento.id, fd)
            .subscribe({
              next: () => this.finishSuccess(),
              error: () => this.showError('Error actualizando imagen'),
            });
        } else {
          this.finishSuccess();
        }
      },
      error: () => this.showError('Error actualizando datos'),
    });
  }

  private finishSuccess() {
    const data: SnackbarData = {
      message: 'Emprendimiento actualizado con éxito!',
      iconName: 'check_circle',
    };

    this.snackBar.openFromComponent(Snackbar, {
      data,
      duration: 3000,
      panelClass: 'snackbar-panel',
      verticalPosition: 'bottom',
    });

    this.dialogRef.close(true);
  }

  private showError(msg: string) {
    this.dialog.open(ErrorDialogModal, {
      data: { message: msg },
      panelClass: 'modal-error',
    });
  }

  cerrarModal() {
    this.dialogRef.close();
  }
}
