import { Routes } from "@angular/router";
import { MainInbox } from "./main/main.component";
import { RegisterInbox } from "./register/register.component";
import { SelectionInbox } from "./selection/selection.component";




export const INBOX_ROUTES: Routes = [
  { path: '', component: MainInbox },
  { path: 'register', component: RegisterInbox },
  { path: 'selection', component: SelectionInbox },
]