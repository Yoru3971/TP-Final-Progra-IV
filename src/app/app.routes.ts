import { Routes } from '@angular/router';
import { RegisterPageDueno } from './pages/register-page-dueno/register-page-dueno';
import { RegisterPageCliente } from './pages/register-page-cliente/register-page-cliente';

export const routes: Routes = [
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
];
