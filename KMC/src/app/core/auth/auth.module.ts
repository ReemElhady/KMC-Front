import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { SharedModule } from 'src/app/@shared/shared.module';
import { VerfiyComponent } from './verfiy/verfiy.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FormsLoadingSpinner } from 'src/app/@shared/forms-loading-spinner/forms-loading-spinner.component';
import { VerifySuccessComponent } from './verify-success/verify-success.component';

@NgModule({
  declarations: [
    LoginComponent,
    CreateAccountComponent,
    ForgetPasswordComponent,
    VerfiyComponent,
    ResetPasswordComponent,
    VerifySuccessComponent,
  ],
  imports: [CommonModule, AuthRoutingModule, SharedModule],
})
export class AuthModule {}
