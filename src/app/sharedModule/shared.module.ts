import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  SearchImageModelComponent, AccordionComponent, AccordionItemComponent, OrderByPipe,  } from "./index";



@NgModule({
  declarations: [
    SearchImageModelComponent,
    AccordionComponent,
    AccordionItemComponent,
    OrderByPipe,

  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    
    FormsModule, ReactiveFormsModule
  ],
  providers: [
   
  ],

  exports: [SearchImageModelComponent, AccordionComponent, AccordionItemComponent, OrderByPipe, ]
})
export class SharedModule { }
