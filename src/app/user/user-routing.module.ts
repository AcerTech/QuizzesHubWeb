import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { LoggedinUserInfoComponent } from './index';

const routes: Routes = [
  { path: 'loggedinUserInfo', component: LoggedinUserInfoComponent, canActivate: [AuthGuard], data: { roles: ["user", "admin"] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
