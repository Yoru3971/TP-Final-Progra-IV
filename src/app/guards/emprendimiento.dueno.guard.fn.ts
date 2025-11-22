import { inject } from "@angular/core";
import { Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../services/auth-service";
import { EmprendimientoService } from "../services/emprendimiento-service";

export const emprendimientoDuenoGuardFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const emprendimientoService = inject(EmprendimientoService);

  const rol = auth.currentUserRole();
  const emprendimientoId = Number(route.paramMap.get('id'));

  // 1) INVITADO / CLIENTE -> pueden pasar sin restricciones
  if (rol === 'INVITADO' || rol === 'CLIENTE') {
    return true;
  }

  // 2) Si es DUENO -> verificar propiedad
  const usuarioId = auth.usuarioId();
  if (!usuarioId) {
    router.navigateByUrl('/login');
    return false;
  }

  const esDueno = emprendimientoService.esDuenoDelEmprendimiento(
    emprendimientoId,
    usuarioId
  );

  if (esDueno) {
    return true;
  }

  // 3) Dueño pero NO es suyo -> 403
  router.navigateByUrl('/error/403');
  return false;
};
