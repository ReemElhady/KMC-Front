import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerfiyComponent } from './verfiy/verfiy.component';
import { VerifySuccessComponent } from './verify-success/verify-success.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'create-account',
    component: CreateAccountComponent,
  },
  {
    path: 'forget-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'verfiy',
    component: VerfiyComponent,
  },
  {
    path: 'reset-password/:id',
    component: ForgetPasswordComponent,
  },
  {
    path: 'verify-success',
    component: VerifySuccessComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
