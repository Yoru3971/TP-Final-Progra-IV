import { ChangeDetectorRef, Component, inject} from '@angular/core';
import { ErrorDialogModal } from '../../shared/components/error-dialog-modal/error-dialog-modal';
import { Snackbar } from '../../shared/components/snackbar/snackbar';
import { SnackbarData } from '../../model/snackbar-data.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmprendimientoResponse } from '../../model/emprendimiento-response.model';

@Component({
  selector: 'app-form-emprendimiento-update',
  imports: [ReactiveFormsModule],
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

  // ARRAY DE CIUDADES (Luego sera eliminado, y utilizaremos una API de ciudades, pero para
  // esta entrega se utilizara esto)
  public readonly CITIES: readonly string[] = [
    'MAR DEL PLATA',
    'MIRAMAR',
    'NECOCHEA',
    'BALCARCE',
    'SANTA CLARA',
    'PINAMAR',
  ] as const;

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
  });

  ngOnInit() {
    this.formEmprendimiento.patchValue({
      nombreEmprendimiento: this.emprendimiento.nombreEmprendimiento,
      ciudad: this.emprendimiento.ciudad,
      direccion: this.emprendimiento.direccion,
      telefono: this.emprendimiento.telefono,
    });

    // Cargar imagen existente
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

  onSubmit() {
    if (this.formEmprendimiento.invalid) return;

    const dto = this.formEmprendimiento.value;

    this.emprendimientoService.updateEmprendimiento(this.emprendimiento.id, dto).subscribe({
      next: () => {
        if (this.newImageFile) {
          const fd = new FormData();
          fd.append('image', this.newImageFile);

          this.emprendimientoService.updateImagenEmprendimiento(this.emprendimiento.id, fd).subscribe({
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