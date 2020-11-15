import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { BooksService, ChapterService, QuizzesService } from '../services';
import { SharedModule } from '../sharedModule/shared.module';
import { BookRoutingModule } from "./book-routing.module";
import {
  ChapterComponent, BookContentComponent, MyBooksComponent, BookComponent,
  QuestionEntryComponent, QuizComponent, AnswerEntryComponent, QuestionListComponent
} from "../books";
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [BookComponent, MyBooksComponent, BookContentComponent, ChapterComponent,
    QuestionListComponent, QuizComponent, QuestionEntryComponent, AnswerEntryComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule,
    BookRoutingModule
  ],
  providers: [
    BooksService,
    ChapterService,
    QuizzesService
  ],
 
})
export class BookModule { }
