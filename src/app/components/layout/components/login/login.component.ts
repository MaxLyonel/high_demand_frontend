// framework angular
import { Component, Inject, inject, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// component dependency
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
// own implementations
import IAuthorizeUser from '../../../../domain/ports/i-authorize-user';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalCustomComponent } from './modal-custom.component';
import { Rol } from '../../../../domain/models/rol.model';
import { AppStore } from '../../../../infrastructure/store/app.store';
import { UserDataService } from '../../../../infrastructure/services/user-data.service';
import { AbilityService } from '../../../../infrastructure/services/ability.service';
import { NzIconModule } from 'ng-zorro-antd/icon';


@Component({
  imports: [
    NzButtonModule,
    NzCardModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
    NzModalModule,
    ReactiveFormsModule
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoginLoading = false;
  passwordVisible = false;

  private fb               = inject(FormBuilder);
  private modal            = inject(NzModalService)
  private viewContainerRef = inject(ViewContainerRef)
  private appStore         = inject(AppStore)
  private userDataService  = inject(UserDataService)
  private abilityService   = inject(AbilityService)

  constructor(@Inject('IAuthorizeUser') private auth: IAuthorizeUser) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmitLogin() {
    if(this.loginForm.invalid) return;

    this.isLoginLoading = true;
    const { username, password } = this.loginForm.value

    setTimeout(() => {
      this.auth.performLogin({ username, password }).subscribe({
        next: () => {
          const { user } = this.appStore.snapshot
          if(user.roles.length > 1 ) {
            const modal = this.modal.create<NzModalCustomComponent, { roles: Rol[] }>({
              nzTitle: 'Selecciona un rol',
              nzContent: NzModalCustomComponent,
              nzViewContainerRef: this.viewContainerRef,
              nzData: {
                roles: user.roles
              },
              nzFooter: null
            });
            modal.afterClose.subscribe((selectedRole: Rol | undefined) => {
              if (selectedRole) {
                const newUser = {
                  ...user,
                  selectedRole: selectedRole
                }
                this.appStore.setUser(newUser)
                this.userDataService.loadUserSpecificData(newUser)
              }
            });
          } else { // aqui falta validacion de igual a 0
            const selectedRole = user.roles[0]
            const newUser = {
              ...user,
              selectedRole: selectedRole
            }
            this.appStore.setUser(newUser)
            this.userDataService.loadUserSpecificData(newUser)
          }
        },
      });
      this.isLoginLoading = false;
    }, 300);
  }
}