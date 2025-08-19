import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
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
import { AbilityService } from "../../../infrastructure/services/ability.service";
import { map } from "rxjs";
import { CommonModule } from "@angular/common";


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
    NzTypographyModule,
    CommonModule
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
  public abilities = inject(AbilityService)
  private cdr = inject(ChangeDetectorRef)

    // Flags reactivas usando el observable de ability
  canManageAdmin$ = this.abilities.ability$.pipe(
    map(ability => ability?.can('manage', 'admin') ?? false)
  );

  canManagePostulation$ = this.abilities.ability$.pipe(
    map(ability => ability?.can('manage', 'postulation') ?? false)
  );

  canManageInbox$ = this.abilities.ability$.pipe(
    map(ability => ability?.can('manage', 'inbox') ?? false)
  );

  canManageFollow$ = this.abilities.ability$.pipe(
    map(ability => ability?.can('manage', 'follow') ?? false)
  );

  ngOnInit(): void {
    const { user } = this.appStore.snapshot
    this.user = user
    this.role = user.selectedRole
    this.cdr.detectChanges()
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