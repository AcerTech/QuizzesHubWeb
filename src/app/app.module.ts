import { BrowserModule } from '@angular/platform-browser';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
// import { QuestionModule } from './questions/question.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthModule } from './auth/auth.module';
import { NgxSpinnerModule } from "ngx-spinner";

import { AuthInterceptor } from "./auth/auth.interceptor";
import { GradeModule } from './grades/grade.module';
import { AdminLinksComponent } from './admin-links/admin-links.component';
import { BookModule } from './books/book.module';
import { ImagesModule } from './images/images.module';
import { UserModule } from './user/user.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { JQ_TOKEN } from "./sharedModule/index";

let jQuery = window["$"];

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavbarComponent,
    AdminLinksComponent,

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    // NgxSpinnerModule,
    GradeModule,
    AuthModule,
    BookModule,
    ImagesModule,
    UserModule,
    BrowserAnimationsModule, ToastrModule.forRoot(),
    //we should put all other modules before the AppRoutingModule 
    AppRoutingModule,
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: JQ_TOKEN, useValue: jQuery },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
