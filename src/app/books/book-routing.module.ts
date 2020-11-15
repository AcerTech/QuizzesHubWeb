import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { MyBooksComponent,QuestionEntryComponent,BookComponent,BookContentComponent,QuestionListComponent } from './index';

const routes: Routes = [
  { path: 'question-entry', component: QuestionEntryComponent, canActivate: [AuthGuard], data: { roles: ["user", "admin"] } },
  { path: 'questions-list', component: QuestionListComponent, canActivate: [AuthGuard], data: { roles: ["user", "admin"] } },
  { path: 'my-books', component: MyBooksComponent, canActivate: [AuthGuard], data: { roles: ["user", "admin"] } },
  { path: 'book', component: BookComponent, canActivate: [AuthGuard], data: { roles: ["user", "admin"] } },
  { path: 'book-content', component: BookContentComponent, canActivate: [AuthGuard], data: { roles: ["user", "admin"] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
