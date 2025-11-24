import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const invitadoGuardFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.currentUserRole() === 'INVITADO') {
    return true;
  }

  router.navigateByUrl('/home');
  return false;
};
