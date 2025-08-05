import { Routes } from '@angular/router';
import { PostulationComponent } from './postulation/postulation.component';
import { RegisterInbox } from './inbox/register/register.component';
import { SelectionInbox } from './inbox/selection/selection.component';


export const HIGH_DEMAND: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component'),
    children: [
      { path: 'postulacion', component: PostulationComponent },
      // { path: 'main-inbox', component: MainInbox },
      { path: 'register-inbox', component: RegisterInbox },
      { path: 'selection-inbox', component: SelectionInbox }
    ]
  }
]