import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { AuthAdapterService } from "../../../adapters/auth-api.service";


@Component({
  selector: 'app-layout',
  imports: [
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    NzDropDownModule,
    NzAvatarModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less'
})
export default class LayoutComponent {
  isCollapsed = false;

  public router = inject(Router)
  private authService = inject(AuthAdapterService)

  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/acceso']);
    });
  }
}