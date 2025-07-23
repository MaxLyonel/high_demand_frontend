import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { LoginComponent } from '../../entries/login/login.component';

export const WELCOME_ROUTES: Routes = [
  { path: '', component: WelcomeComponent },
];
