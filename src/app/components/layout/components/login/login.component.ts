// framework angular
import { Component, Inject, inject } from '@angular/core';
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

@Component({
  imports: [
    NzButtonModule,
    NzCardModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    ReactiveFormsModule
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoginLoading = false;

  private router = inject(Router)
  private fb = inject(FormBuilder);

  constructor(@Inject('IAuthorizeUser') private auth: IAuthorizeUser) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      this.isLoginLoading = true;
      const { username, password } = this.loginForm.value
      setTimeout(() => {
        this.auth.performLogin({ username, password }).subscribe({
          next: () => this.router.navigate(['/alta-demanda/postulacion']),
        })
        this.isLoginLoading = false;
      }, 500);
    }
  }
}