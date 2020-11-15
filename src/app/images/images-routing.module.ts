import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImagesComponent, UploadFilesComponent, UploaderComponent } from "./index";

// import { ImagesComponent } from './images/images.component';
// import { UploaderComponent } from './uploader/uploader.component';
// import { UploadFilesComponent } from './upload-files/upload-files.component';
import { AuthGuard } from "../auth/auth.guard";

const routes: Routes = [
  { path: 'images', component: ImagesComponent, canActivate: [AuthGuard], data: { roles: ["user", "admin"] } },
  { path: 'uploader', component: UploaderComponent, canActivate: [AuthGuard], data: { roles: ["user", "admin"] } },
  { path: 'upload-files', component: UploadFilesComponent, canActivate: [AuthGuard], data: { roles: ["user", "admin"] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImagesRoutingModule { }
