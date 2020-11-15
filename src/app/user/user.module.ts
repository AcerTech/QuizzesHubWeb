import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoggedinUserInfoComponent } from './loggedin-user-info/loggedin-user-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../sharedModule/shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [LoggedinUserInfoComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule,
    UserRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule { }
