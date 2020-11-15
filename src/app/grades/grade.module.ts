import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { GradeRoutingModule } from './grade-routing.module';
import { GradeComponent } from './grade/grade.component';
import { GradesListComponent } from './grades-list/grades-list.component';


@NgModule({
  declarations: [GradeComponent, GradesListComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    GradeRoutingModule
  ]
})
export class GradeModule { }
