import { Routes } from '@angular/router';
import { RegisterPageDueno } from './pages/register-page-dueno/register-page-dueno';
import { RegisterPageCliente } from './pages/register-page-cliente/register-page-cliente';
import { Login } from './pages/login/login';
import { RegisterSuccessPage } from './pages/register-success-page/register-success-page';
import { HomePage } from './pages/home-page/home-page';
import { CrearEmprendimientoPageDueno } from './pages/crear-emprendimiento-page-dueno/crear-emprendimiento-page-dueno';
import { EmprendimientoPage } from './pages/emprendimiento-page/emprendimiento-page';
import { PerfilUsuario } from './pages/perfil-usuario/perfil-usuario';
import { HomeRouter } from './router/home-router/home-router';

export const routes: Routes = [
  { path: 'home', component: HomeRouter },

  { path: 'me', component: PerfilUsuario },

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

  { path: 'login', component: Login },

  {
    path: 'crear-emprendimiento',
    component: CrearEmprendimientoPageDueno,
  },

  {
    path: 'emprendimiento/:id',
    component: EmprendimientoPage,
  },

  //REVISAR que hacemos con esto y los guards
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: '**', redirectTo: '/home' },
];
