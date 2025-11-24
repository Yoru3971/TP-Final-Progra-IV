import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from '../../model/login-response.model';
import { AuthService } from '../../services/auth-service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogModal } from '../../shared/components/error-dialog-modal/error-dialog-modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Snackbar } from '../../shared/components/snackbar/snackbar';
import { SnackbarData } from '../../model/snackbar-data.model';

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
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  formLogin = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    recordarme: [false],
  });

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    const usuario = this.formLogin.value;
    this.authService
      .login({
        email: usuario.email || '',
        password: usuario.password || '',
      })
      .subscribe({
        next: (response: LoginResponse) => {
          const snackbarData: SnackbarData = {
            message: 'Sesión iniciada correctamente',
            iconName: 'check_circle',
          };

          this.snackBar.openFromComponent(Snackbar, {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: 'snackbar-panel',
            data: snackbarData,
          });

          this.authService.handleLoginSuccess(
            response.token,
            response.usuarioID,
            usuario.recordarme!
          );
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        },
        error: (err) => {
          const backendMsg =
            err.error?.message || err.error?.error || 'Error desconocido en el login';

          console.error(backendMsg);

          this.dialog.open(ErrorDialogModal, {
            data: { message: backendMsg },
            panelClass: 'modal-error',
            autoFocus: false,
            restoreFocus: false,
          });

          this.formLogin.get('password')?.reset();
          this.formLogin.get('recordarme')?.reset();
        },
      });
  }
}
