import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from '../../model/login-response.model';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-form-login',
  imports: [ReactiveFormsModule],
  templateUrl: './form-login.html',
  styleUrl: './form-login.css',
})
export class FormLogin {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  formLogin = this.fb.group(
    {
      email: ['', [Validators.required]],
      password: ['',[Validators.required]],
      recordarme: [false]
    }
  );

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login(){
    const usuario = this.formLogin.value;
    this.authService
      .login({
        email: usuario.email || '',
        password: usuario.password || ''
      })
      .subscribe({
        next: (response: LoginResponse) => {
          alert('Login exitoso');
          this.authService.handleLoginSuccess(response.token, usuario.recordarme!);
          this.router.navigate(['']);     //  AGREGAR debería redirigir a la página principal (páginas distintas dependiendo del rol?)
        },
        error: (err) => {                 //  REVISAR cómo manejar los errores
          const backendMsg =
            err.error?.message || err.error?.error || 'Error desconocido en el login';

          console.error('Error en el login:', backendMsg);
        }
      })

  }

}
