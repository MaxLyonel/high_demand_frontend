import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import IAuthorizeUser from '../../../../domain/ports/i-authorize-user';

@Component({
  imports: [
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    ReactiveFormsModule
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoginLoading = false;
// @Inject('IAuthorizeUser') private auth: IAuthorizeUser
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      this.isLoginLoading = true;
      console.log('Login form submitted', this.loginForm.value);
      // Simular llamada API
      const { username, password } = this.loginForm.value
      // this.auth.login({ username, password }).subscribe(user => {
      //   console.log('Autenticado: ', user)
      // })
      setTimeout(() => {
        this.isLoginLoading = false;
      }, 2500);
    }
  }
}