import { Routes } from '@angular/router';

// export const routes: Routes = [
//   { path: '', pathMatch: 'full', redirectTo: '/postulacion' },
//   { path: 'login', loadComponent: () => import('./login/login.component')},
//   { path: 'postulacion', loadChildren: () => import('./pages/postulation/postulation.routes').then(m => m.POSTULATION_ROUTES) },
//   { path: 'main-inbox', loadChildren: () => import('./pages/inbox/inbox.routes').then(m => m.INBOX_ROUTES)},
//   { path: 'register-inbox', loadChildren: () => import('./pages/inbox/inbox.routes').then(m => m.INBOX_ROUTES)},
//   { path: 'selection-inbox', loadChildren: () => import('./pages/inbox/inbox.routes').then(m => m.INBOX_ROUTES)}
// ];

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/entradas'},
  { path: 'entradas', loadChildren: () => import('./entries/access.routes').then(m => m.ACCESS_ROUTES)},
  { path: 'main', loadChildren: () => import('./main/main.routes').then(m => m.MAIN_ROUTES) },
]