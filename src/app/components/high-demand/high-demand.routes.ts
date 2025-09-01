import { Routes } from '@angular/router';
import { PostulationComponent } from './postulation/postulation.component';
import { RegisterInbox } from './inbox/register/register.component';
import { SelectionInbox } from './inbox/selection/selection.component';
import { BandejaComponent } from './inbox/main/main.component';
import { SeguimientoComponent } from './follow-up/follow-up.component';
import { OperativoConfigComponent } from './admin/admin.component';
// import { ControlAccessComponent } from './control-access/control-access.component';
import { AccessControlComponent } from './control-access/control-access.component';


export const HIGH_DEMAND: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component'),
    children: [
      { path: 'dashboard', component: AccessControlComponent },
      // { path: 'control-acceso', component: DashboardComponent },
      { path: 'postulacion', component: PostulationComponent },
      { path: 'main-inbox', component: BandejaComponent },
      { path: 'register-inbox', component: RegisterInbox },
      { path: 'selection-inbox', component: SelectionInbox },
      { path: 'follow-up', component: SeguimientoComponent },
      { path: 'admin', component: OperativoConfigComponent },
    ]
  },
  {
    path: '**',
    redirectTo: ''
  },
]