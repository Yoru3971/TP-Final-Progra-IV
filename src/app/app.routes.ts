import { Routes } from '@angular/router';
import { RegisterPageDueno } from './pages/register-page-dueno/register-page-dueno';

export const routes: Routes = [
    {path: 'registro/:rol', component: RegisterPageDueno},
];
