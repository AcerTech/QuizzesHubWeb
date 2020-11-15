import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLinksComponent } from './admin-links/admin-links.component';
import { AuthGuard } from './auth/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [

  { path: "", pathMatch: "full", redirectTo: "/my-books" },
  { path: 'admin-links', component: AdminLinksComponent, canActivate: [AuthGuard], data: { roles: ["admin"] } },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
