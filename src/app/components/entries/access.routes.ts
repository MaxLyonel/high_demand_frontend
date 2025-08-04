import { Routes } from "@angular/router";
import { PreRegistrationComponent } from "./pre-registration/pre-registration.component";
import { FollowUpComponent } from "./follow-up/follow-up.component";
import { LoginComponent } from "./login/login.component";


export const ACCESS_ROUTES: Routes = [
  { path: '',
    loadComponent: () => import('./layout.component'),
    children: [
      { path: 'pre-inscripcion', component: PreRegistrationComponent },
      { path: 'follow-up',       component: FollowUpComponent },
      { path: 'login',           component: LoginComponent }
    ]
  },
]