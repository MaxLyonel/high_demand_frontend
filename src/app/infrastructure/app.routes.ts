import { Routes } from '@angular/router';
import { canAccessLoginGuard } from './guards/can-access-login.guard';

export const mainRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/acceso'},
  { path: 'acceso',      loadComponent: () => import('../components/layout/layout.component'), canActivate: [canAccessLoginGuard]},
  { path: 'alta-demanda', loadChildren: () => import('../components/high-demand/high-demand.routes').then(m => m.HIGH_DEMAND)},
]