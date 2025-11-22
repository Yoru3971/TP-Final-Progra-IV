import { Routes } from '@angular/router';
import { RegisterPageDueno } from './pages/register-page-dueno/register-page-dueno';
import { RegisterPageCliente } from './pages/register-page-cliente/register-page-cliente';
import { Login } from './pages/login/login';
import { RegisterSuccessPage } from './pages/register-success-page/register-success-page';
import { HomePage } from './pages/home-page/home-page';
import { SobreNosotrosPage } from './pages/sobre-nosotros-page/sobre-nosotros-page';
import { SobreMivianditaPage } from './pages/sobre-miviandita-page/sobre-miviandita-page';
import { RecuperarPasswordPage } from './pages/recuperar-password-page/recuperar-password-page';
import { NormasComunidadPage } from './pages/normas-comunidad-page/normas-comunidad-page';
import { BasesCondicionesPage } from './pages/bases-condiciones-page/bases-condiciones-page';

export const routes: Routes = [
  { path: 'home', component: HomePage },
  {
    path: 'registro/dueno',
    component: RegisterPageDueno,
    data: { rol: 'DUENO' },
  },
  {
    path: 'registro/cliente',
    component: RegisterPageCliente,
    data: { rol: 'CLIENTE' },
  },
  {
    path: 'registro-exitoso',
    component: RegisterSuccessPage,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'sobre-miviandita',
    component: SobreMivianditaPage,
  },
  {
    path: 'sobre-nosotros',
    component: SobreNosotrosPage,
  },
  {
    path: 'recuperar-password',
    component: RecuperarPasswordPage,
  },
  {
    path: 'normas-comunidad',
    component: NormasComunidadPage,
  },
  {
    path: 'bases-condiciones',
    component: BasesCondicionesPage,
  },
  //REVISAR habria que ver que hacemos con la ruta vacia, tal vez podriamos redirigir a una pagina de "OOPS" o algo asi 
  { 
    // Redirige la ruta vacía a /home
    path: '',
    redirectTo: '/home', 
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '/home' }, // Redirige cualquier otra ruta a home
];
