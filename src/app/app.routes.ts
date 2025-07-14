import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/postulacion' },
  // { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) },
  { path: 'postulacion', loadChildren: () => import('./pages/postulation/postulation.routes').then(m => m.POSTULATION_ROUTES) },
  { path: 'main-inbox', loadChildren: () => import('./pages/inbox/inbox.routes').then(m => m.INBOX_ROUTES)},
  { path: 'register-inbox', loadChildren: () => import('./pages/inbox/inbox.routes').then(m => m.INBOX_ROUTES)},
  { path: 'selection-inbox', loadChildren: () => import('./pages/inbox/inbox.routes').then(m => m.INBOX_ROUTES)}
];
