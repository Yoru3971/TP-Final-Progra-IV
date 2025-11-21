import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogModal } from '../../shared/components/error-dialog-modal/error-dialog-modal';
import { AuthService } from '../../services/auth-service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarData } from '../../model/snackbar-data.model';
import { Snackbar } from '../../shared/components/snackbar/snackbar';

@Component({
  selector: 'app-form-emprendimiento',
  imports: [ReactiveFormsModule],
  templateUrl: './form-emprendimiento.html',
  styleUrl: './form-emprendimiento.css',
})
export class FormEmprendimiento {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private emprendimientoService = inject(EmprendimientoService);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<FormEmprendimiento>);
  private snackBar = inject(MatSnackBar);

  selectedFileName: string | null = null;
  public imagePreviewUrl: string | ArrayBuffer | null = null; //Propiedad para la previsualización

  // Referencia al input de tipo file para poder resetearlo
  // Esto es necesario para permitir la selección del mismo archivo de nuevo después de eliminarlo
  fileInputRef: any;

  //maximos tamaño de la imagen
  maxWidth = 1920;
  maxHeight = 1080;

  onFileInputReady(element: HTMLInputElement) {
    this.fileInputRef = element;
  }

  formEmprendimiento = this.fb.group({
    nombreEmprendimiento: [
      '',
      [Validators.required, Validators.minLength(1), Validators.maxLength(255)],
    ],
    image: [null, Validators.required],
    ciudad: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    direccion: ['', Validators.maxLength(255)],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
  });

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.width <= this.maxWidth && img.height <= this.maxHeight) {
            this.formEmprendimiento.patchValue({ image: file });
          } else {
            this.formEmprendimiento.patchValue({ image: null });
            this.dialog.open(ErrorDialogModal, {
              data: { message: `La imagen no debe superar ${this.maxWidth}x${this.maxHeight}px` },
              panelClass: 'modal-error',
            });
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.formEmprendimiento.invalid) return;

    const formData = new FormData();
    const formValues = this.formEmprendimiento.value;

    formData.append('nombreEmprendimiento', formValues.nombreEmprendimiento!);
    formData.append('image', formValues.image!);
    formData.append('ciudad', formValues.ciudad!);
    formData.append('direccion', formValues.direccion || '');
    formData.append('telefono', formValues.telefono!);

    const userId = this.authService.usuarioId();
    if (!userId) {
      this.dialog.open(ErrorDialogModal, {
        data: { message: 'Error: no se pudo obtener el usuario logueado.' },
        panelClass: 'modal-error',
      });
      return;
    }

    formData.append('idUsuario', String(userId));

    this.emprendimientoService.createEmprendimiento(formData).subscribe({
      next: () => {
        const snackbarData: SnackbarData = {
          message: 'Emprendimiento creado con éxito!',
          iconName: 'check_circle',
        };

        this.snackBar.openFromComponent(Snackbar, {
          data: snackbarData,
          duration: 3000,
          panelClass: 'snackbar-panel',
          verticalPosition: 'bottom',
        });

        this.dialogRef.close(true);
      },
      error: (err) => {
        const backendMsg = err.error?.message || 'Error desconocido al crear el emprendimiento';

        this.dialog.open(ErrorDialogModal, {
          data: { message: backendMsg },
          panelClass: 'modal-error',
        });
      },
    });
  }

  removeImage() {
    this.selectedFileName = null;
    this.imagePreviewUrl = null;
    this.formEmprendimiento.get('image')?.setValue(null);
    this.formEmprendimiento.get('image')?.markAsDirty(); // Marca como dirty para que el required se muestre

    if (this.fileInputRef) {
      this.fileInputRef.value = '';
    }
  }
}
