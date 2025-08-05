import { Routes } from '@angular/router';

export const mainRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/acceso'},
  { path: 'acceso',      loadComponent: () => import('./layout/layout.component')},
  { path: 'alta-demanda', loadChildren: () => import('./high-demand/high-demand.routes').then(m => m.HIGH_DEMAND)},
]