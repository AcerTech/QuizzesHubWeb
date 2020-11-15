import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from "./auth.interceptor";
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { ConfirmComponent } from './confirm/confirm.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ForgotpasswordComponent, ResetPasswordComponent, ForbiddenComponent, ConfirmComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    AuthRoutingModule
  ],
  providers: [

  ]
})
export class AuthModule { }
