import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagesComponent, UploadFilesComponent, UploaderComponent, DropzoneDirective, FileUploaderComponent, UploadTaskComponent } from "./index";
import { ImagesRoutingModule } from './images-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImagesService } from '../services';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from "../../environments/environment";

@NgModule({
  declarations: [
    ImagesComponent,
    UploadFilesComponent,
    UploaderComponent,
    FileUploaderComponent,
    UploadTaskComponent,
    DropzoneDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxFileDropModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    ImagesRoutingModule
  ],
  providers: [ImagesService,]
})
export class ImagesModule { }
