import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'vuelos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/vuelos/vuelos.page').then(m => m.VuelosPage),
  },
  {
    path: 'cierre/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cierre-vuelo/cierre-vuelo.page').then(m => m.CierreVueloPage),
  },
  { path: '', redirectTo: 'vuelos', pathMatch: 'full' },
  { path: '**', redirectTo: 'vuelos' },
];
