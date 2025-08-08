import { Routes } from '@angular/router';

export const mainRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/acceso'},
  { path: 'acceso',      loadComponent: () => import('../components/layout/layout.component')},
  { path: 'alta-demanda', loadChildren: () => import('../components/high-demand/high-demand.routes').then(m => m.HIGH_DEMAND)},
]