import { Component, inject, Input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from '../../../services/registro-service';
import { ErrorDialogModal } from '../error-dialog-modal/error-dialog-modal';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-form-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './form-registro.html',
  styleUrl: './form-registro.css',
})
export class FormRegistro {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private registroService = inject(RegistroService);
  private dialog = inject(MatDialog);

  //Como este form va dentro de una pagina (componente padre) que define el rol desde la URL, lo recibo por Input, luego desde la pagina padre le paso el rol correspondiente.
  @Input() rolUsuario: string = '';

  formRegistro = this.fb.group(
    {
      nombreCompleto: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      ],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/
          ),
        ],
      ],
      confirmarPassword: ['', [Validators.required]],
      aceptarTerminos: [false, Validators.requiredTrue],
      aceptarPoliticas: [false, Validators.requiredTrue],
    },
    { validators: this.passwordsCoinciden }
  );

  onSubmit() {
    const usuario = this.formRegistro.value;
    this.registroService
      .registrarUsuario({
        nombreCompleto: usuario.nombreCompleto || '',
        email: usuario.email || '',
        password: usuario.password || '',
        telefono: usuario.telefono || '',
        rolUsuario: this.rolUsuario,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/registro-exitoso']);
        },
        error: (err) => {
          // Por si el backend devuelve un mensaje dentro de error.error (estructura del back)
          const backendMsg =
            err.error?.message || err.error?.error || 'Error desconocido en el registro';

          console.error(backendMsg);

          this.dialog.open(ErrorDialogModal, {
            data: {
              message: backendMsg, // Pasa el mensaje al diálogo
            },
          });

          // Resetear el formulario o la contraseña para que el usuario intente de nuevo
          this.formRegistro.get('password')?.reset();
          this.formRegistro.get('confirmarPassword')?.reset();
          this.formRegistro.get('aceptarTerminos')?.setValue(false);
          this.formRegistro.get('aceptarPoliticas')?.setValue(false);
        },
      });
  }

  // Variables para mostrar/ocultar contraseñas
  showPassword = false;
  showConfirmPassword = false;

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordsCoinciden(form: any) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmarPassword')?.value;
    return pass === confirm ? null : { noCoinciden: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
