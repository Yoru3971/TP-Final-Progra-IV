import { Routes } from '@angular/router';
import { RegisterPageDueno } from './pages/register-page-dueno/register-page-dueno';
import { RegisterPageCliente } from './pages/register-page-cliente/register-page-cliente';
import { Login } from './pages/login/login';
import { EmprendimientoPage } from './pages/emprendimiento-page/emprendimiento-page';
import { PerfilUsuario } from './pages/perfil-usuario/perfil-usuario';
import { HomeRouter } from './router/home-router/home-router';
import { authGuardFn } from './guards/auth.guard.fn';
import { invitadoGuardFn } from './guards/invitado.guard.fn';
import { emprendimientoDuenoGuardFn } from './guards/emprendimiento.dueno.guard.fn';
import { Error403Page } from './pages/redirects/error403-page/error403-page';
import { Error404Page } from './pages/redirects/error404-page/error404-page';
import { SobreNosotrosPage } from './pages/sobre-nosotros-page/sobre-nosotros-page';
import { SobreMivianditaPage } from './pages/sobre-miviandita-page/sobre-miviandita-page';
import { RecuperarPasswordPage } from './pages/recuperar-password-page/recuperar-password-page';
import { NormasComunidadPage } from './pages/normas-comunidad-page/normas-comunidad-page';
import { BasesCondicionesPage } from './pages/bases-condiciones-page/bases-condiciones-page';
import { Error418Page } from './pages/redirects/error418-page/error418-page';

export const routes: Routes = [
  /* -------------------- HOME -------------------- */
  { path: 'home', component: HomeRouter },

  /* -------------------- PERFIL (solo logeados) -------------------- */
  { path: 'me', component: PerfilUsuario, canActivate: [authGuardFn] },

  /* -------------------- REGISTROS (solo invitados) -------------------- */
  { path: 'registro/dueno', component: RegisterPageDueno, canActivate: [invitadoGuardFn] },
  { path: 'registro/cliente', component: RegisterPageCliente, canActivate: [invitadoGuardFn] },

  /* -------------------- LOGIN (solo invitados) -------------------- */
  { path: 'login', component: Login, canActivate: [invitadoGuardFn] },

  /* -------------------- EMPRENDIMIENTO -------------------- */
  // Invitado → puede ver
  // Cliente → puede ver
  // Dueño → solo si es suyo
  {
    path: 'emprendimiento/:id',
    component: EmprendimientoPage,
    canActivate: [emprendimientoDuenoGuardFn],
  },

  /* -------------------- ERRORES -------------------- */
  { path: 'error/403', component: Error403Page },
  { path: 'error/404', component: Error404Page },
  { path: 'error/418', component: Error418Page },

  /* -------------------- PÁGINAS VARIAS -------------------- */
  { path: 'sobre-miviandita', component: SobreMivianditaPage },
  { path: 'sobre-nosotros', component: SobreNosotrosPage },
  { path: 'recuperar-password', component: RecuperarPasswordPage },
  { path: 'normas-comunidad', component: NormasComunidadPage },
  { path: 'bases-condiciones', component: BasesCondicionesPage },

  /* -------------------- REDIRECTS BASICOS -------------------- */
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/error/404' },
];
