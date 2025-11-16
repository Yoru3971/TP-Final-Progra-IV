import { Routes } from '@angular/router';
import { RegisterPageDueno } from './pages/register-page-dueno/register-page-dueno';
import { RegisterPageCliente } from './pages/register-page-cliente/register-page-cliente';
import { Login } from './pages/login/login';
import { RegisterSuccessPage } from './pages/register-success-page/register-success-page';
import { HomePage } from './pages/home-page/home-page';
import { CrearEmprendimientoPageDueno } from './pages/crear-emprendimiento-page-dueno/crear-emprendimiento-page-dueno';

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
    path: 'crear-emprendimiento', 
    component: CrearEmprendimientoPageDueno
  },
  //REVISAR habria que ver que hacemos con la ruta vacia, tal vez podriamos redirigir a una pagina  de "OOPS" o algo asi 
  { 
    path: '', redirectTo: '/home', 
    pathMatch: 'full' }, // Redirige la ruta vacía a /home
  
    { path: '**', redirectTo: '/home' }, // Redirige cualquier otra ruta a home
];
