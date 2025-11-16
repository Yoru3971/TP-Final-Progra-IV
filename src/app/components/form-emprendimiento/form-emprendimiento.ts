import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogModal } from '../../shared/components/error-dialog-modal/error-dialog-modal';
import { AuthService } from '../../services/auth-service';

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

  //maximos tamaño de la imagen
  maxWidth = 1920;
  maxHeight = 1080;

  formEmprendimiento = this.fb.group({
    nombreEmprendimiento: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    image: [null, Validators.required],
    ciudad: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    direccion: ['', Validators.maxLength(255)],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
  });

  //valido la imagen y una resolucion maxima
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

  // 🔹 Agregamos el ID del usuario logueado desde el AuthService
  const userId = this.authService.usuarioId();
  if (!userId) {
  this.dialog.open(ErrorDialogModal, {
    data: { message: 'Error: no se pudo obtener el usuario logueado.' }
  });
  return; // <-- return vacío, devuelve void y se soluciona
}

  formData.append('idUsuario', String(userId));

  this.emprendimientoService.createEmprendimiento(formData).subscribe({
    next: () => this.router.navigate(['/mis-emprendimientos']),
    error: (err) => {
      const backendMsg = err.error?.message || 'Error desconocido al crear el emprendimiento';
      this.dialog.open(ErrorDialogModal, {
        data: { message: backendMsg }
      });
    },
  });
}

}
