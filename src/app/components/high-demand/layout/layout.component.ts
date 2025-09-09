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
import { map, tap } from "rxjs";
import { CommonModule } from "@angular/common";
import * as iconv from 'iconv-lite'
import { Buffer } from 'buffer'
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDescriptionsModule } from "ng-zorro-antd/descriptions";
import { NzDividerModule } from "ng-zorro-antd/divider";


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
    NzDrawerModule,
    NzDescriptionsModule,
    NzDividerModule,
    CommonModule
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less'
})
export default class LayoutComponent implements OnInit{
  isCollapsed = false;
  user!: any
  role!: any
  roleName!: any

  visibleProfile:boolean = false


  public router = inject(Router)
  private authService = inject(AuthAdapterService)
  private appStore = inject(AppStore)
  public abilities = inject(AbilityService)
  private cdr = inject(ChangeDetectorRef)

    // Flags reactivas usando el observable de ability
  canManageAdmin$ = this.abilities.ability$.pipe(
    map(ability => ability?.can('manage', 'admin') ?? false)
  );

  canReadPostulation$ = this.abilities.ability$.pipe(
    map(ability => ability?.can('create', 'postulation') ?? false)
  );

  canReadInbox$ = this.abilities.ability$.pipe(
    map(ability => ability?.can('read', 'inbox') ?? false)
  );

  canReadInboxRegister$ = this.abilities.ability$.pipe(
    map(ability => ability?.can('read', 'inbox-register'))
  )

  canReadInboxSelection$ = this.abilities.ability$.pipe(
    map(ability => ability?.can('read', 'inbox-selection'))
  )

  canReadFollow$ = this.abilities.ability$.pipe(
    map(ability => ability?.can('read', 'history') ?? false)
  );

  canManageConfig$ = this.abilities.ability$.pipe(
    map(ability => ability?.can('manage', 'config'))
  )

  ngOnInit(): void {
    const { user } = this.appStore.snapshot
    this.user = user
    this.role = user.selectedRole
    const buffer = Buffer.from(user.selectedRole.role.name, 'latin1')
    this.roleName = iconv.decode(buffer, 'utf-8')
    this.cdr.detectChanges()

    this.abilities.loadAbilities(user.id).subscribe(() => {
      const ability = this.abilities.getAbility();
      // console.log('Abilities cargadas:', ability?.rules);
    });
  }

  goToProfile() {
    this.visibleProfile = true
    // this.router.navigate(['/perfil']);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/acceso']);
    });
  }

  close() {
    this.visibleProfile = false
  }
}