import { Component, inject, Input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from '../../services/registro-service';

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

  //Como este form va dentro de una pagina (componente padre) que define el rol desde la URL, lo recibo por Input, luego desde la pagina padre le paso el rol correspondiente.
  @Input() rolUsuario: string = '';

  formRegistro = this.fb.group(
    {
      nombreCompleto: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(255)],
      ],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
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
          alert('Registro exitoso');
          // Redirige al usuario a la página de login después del registro exitoso, idealmente podría ser una pagina con un mensaje de exito y un boton para ir al login.
          this.router.navigate(['/login']);
        },
        error: (err) => {
          // Si el backend devuelve un mensaje dentro de error.error (estructura del back)
          //Mas adelante hay que cambiarlo para mostrar el mensaje en el HTML del form o con un modal
          const backendMsg =
            err.error?.message || err.error?.error || 'Error desconocido en el registro';

          console.error('Error en el registro:', backendMsg);
        },
      });
  }
}
