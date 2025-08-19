import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { AuthAdapterService } from "../../../adapters/auth-api.service";
import { AppStore } from "../../../infrastructure/store/app.store";
import { NzTypographyModule } from "ng-zorro-antd/typography";


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
    NzAvatarModule,
    NzTypographyModule
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less'
})
export default class LayoutComponent implements OnInit{
  isCollapsed = false;
  user!: any
  role!: any


  public router = inject(Router)
  private authService = inject(AuthAdapterService)
  private appStore = inject(AppStore)

  ngOnInit(): void {
    const { user } = this.appStore.snapshot
    this.user = user
    this.role = user.selectedRole
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/acceso']);
    });
  }
}