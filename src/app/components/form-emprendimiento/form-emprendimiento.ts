import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogModal } from '../../shared/components/error-dialog-modal/error-dialog-modal';
import { AuthService } from '../../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarData } from '../../model/snackbar-data.model';
import { Snackbar } from '../../shared/components/snackbar/snackbar';
import { ChangeDetectorRef } from '@angular/core';

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
  private cdr = inject(ChangeDetectorRef); //NECESARIO PARA FORZAR RENDER

  selectedFileName: string | null = null;
  public imagePreviewUrl: string | ArrayBuffer | null = null;

  fileInputRef: any;

  maxWidth = 1920;
  maxHeight = 1080;

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

  onFileInputReady(element: HTMLInputElement) {
    this.fileInputRef = element;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.selectedFileName = null;
      this.imagePreviewUrl = null;
      this.formEmprendimiento.get('image')?.setValue(null);
      this.formEmprendimiento.get('image')?.markAsTouched();
      this.cdr.detectChanges(); //asegura actualización al limpiar
      return;
    }

    this.selectedFileName = file.name;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreviewUrl = e.target.result;

      //esto evita que necesites "hacer click afuera" para ver el preview
      this.cdr.detectChanges();

      // Validar dimensiones
      const img = new Image();
      img.onload = () => {
        if (img.width <= this.maxWidth && img.height <= this.maxHeight) {
          this.formEmprendimiento.patchValue({ image: file });
          this.formEmprendimiento.get('image')?.markAsPristine();
          this.formEmprendimiento.get('image')?.markAsUntouched();
        } else {
          this.formEmprendimiento.patchValue({ image: null });
          this.imagePreviewUrl = null;
          this.selectedFileName = null;

          this.dialog.open(ErrorDialogModal, {
            data: { message: `La imagen no debe superar ${this.maxWidth}x${this.maxHeight}px` },
            panelClass: 'modal-error',
          });
        }

        this.formEmprendimiento.get('image')?.markAsTouched();
        this.cdr.detectChanges(); //asegura actualización final
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  removeImage() {
    this.selectedFileName = null;
    this.imagePreviewUrl = null;
    this.formEmprendimiento.get('image')?.setValue(null);
    this.formEmprendimiento.get('image')?.markAsDirty();

    if (this.fileInputRef) {
      this.fileInputRef.value = '';
    }

    this.cdr.detectChanges(); //asegura que desaparezca el preview inmediatamente
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
}
