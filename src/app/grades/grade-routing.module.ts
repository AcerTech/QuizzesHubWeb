import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { GradeComponent } from './grade/grade.component';

const routes: Routes = [
  { path: 'grades', component: GradeComponent, canActivate: [AuthGuard], data: { roles: ["admin"] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradeRoutingModule { }
