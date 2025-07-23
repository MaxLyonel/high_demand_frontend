import { Component, ViewEncapsulation } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzInputModule } from "ng-zorro-antd/input";
import { PreRegistrationComponent } from "./pre-registration/pre-registration.component";
import { FollowUpComponent } from "./follow-up/follow-up.component";
import { LoginComponent } from "./login/login.component";

@Component({
  selector: 'app-auth-layout',
  imports: [
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    ReactiveFormsModule,
    PreRegistrationComponent,
    FollowUpComponent,
    LoginComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  encapsulation: ViewEncapsulation.None
})
export default class LayoutComponent {}