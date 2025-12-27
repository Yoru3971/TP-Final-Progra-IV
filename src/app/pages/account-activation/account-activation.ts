import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-activation',
  imports: [RouterLink, FormsModule],
  templateUrl: './account-activation.html',
  styleUrl: './account-activation.css',
})
export class AccountActivation implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estados de la vista
  isLoading = signal<boolean>(true);
  isSuccess = signal<boolean>(false);
  message = signal<string>('Procesando solicitud...');

  // Lógica para reenviar
  showResendForm = signal<boolean>(false);
  emailToResend = signal<string>('');
  isResending = signal<boolean>(false);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.validarToken(token);
    } else {
      this.mostrarError('Token no proporcionado.');
    }
  }

  private validarToken(token: string) {
    this.authService.verifyAccount(token).subscribe({
      next: (responseMsg) => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
        this.message.set(responseMsg);
      },
      error: (err) => {
        let msg = 'El enlace ha expirado o no es válido.';
        if (err.error) {
          try {
            const json = JSON.parse(err.error);
            msg = json.error || json.message || msg;
          } catch (e) {
            msg = err.error;
          }
        }
        this.mostrarError(msg);

        this.showResendForm.set(true);
      },
    });
  }

  private mostrarError(msg: string) {
    this.isLoading.set(false);
    this.isSuccess.set(false);
    this.message.set(msg);
  }

  public onResend() {
    if (!this.emailToResend() || !this.emailToResend().includes('@')) {
      alert('Por favor ingresa un email válido');
      return;
    }

    this.isResending.set(true);

    this.authService.resendToken(this.emailToResend()).subscribe({
      next: (res) => {
        this.isResending.set(false);
        this.showResendForm.set(false);
        this.isLoading.set(false);
        this.isSuccess.set(true);
        this.message.set('¡Listo! Te enviamos un nuevo correo de validación.');
      },
      error: (err) => {
        this.isResending.set(false);
        
        let mensajeError = 'Intente nuevamente';

        if (err.error) {
          try {
            const errorObj = JSON.parse(err.error);
            if (errorObj.error) {
              mensajeError = errorObj.error;
            }
          } catch (e) {
            mensajeError = err.error;
          }
        }
        
        alert('Error: ' + mensajeError);
      }
    });
  }
}
