import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';

import { Question, QuestionType, Quiz, Grade, Chapter, Subject } from 'src/app/models/interfaces';
import { environment } from "../../environments/environment";
const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http: HttpClient) { }

  getQuestionsTypes() {
    return this.http.get(url + "questionsTypes").pipe(
      map((data: any) => <QuestionType[]>data),
      // tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getSubjectsForGrade(gradeId) {
    // console.log(gradeId)
    return this.http.get(url + "subjects/bygradeid/" + gradeId).pipe(
      map((data: any) => <Subject[]>data),
      // tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getSubjects() {
    return this.http.get(url + "subjects").pipe(
      map((data: any) => <Subject[]>data),
      // tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getChaptersForSubject(subjectId) {
    // console.log(subjectId)
    return this.http.get(url + "chapters/bysubjectid/" + subjectId).pipe(
      map((data: any) => <Chapter[]>data),
      // tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getQuizesForChapter(chapterId) {
    return this.http.get(url + "quizzes/bychapterid/" + chapterId).pipe(
      map((data: any) => <Quiz[]>data),
      // tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getQuizes() {
    return this.http.get(url + "quizzes").pipe(
      map((data: any) => <Quiz[]>data),
      // tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getQuizesByChapterId(chapterId: string) {
    return this.http.get(url + "quizzes/bychapterid/" + chapterId).pipe(
      map((data: any) => <Quiz[]>data),
      // tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getQuestionsByBookId(bookId) {
    return this.http.get(url + "questions/bybookid/" + bookId).pipe(
      map((data: any) => <Question[]>data),
      // tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getQuestionsByChapterId(chapterId: string) {
    return this.http.get(url + "questions/bychapterid/" + chapterId).pipe(
      map((data: any) => <Question[]>data),
      // tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getQuestionsByQuizId(quizId) {
    return this.http.get(url + "questions/byquizid/" + quizId).pipe(
      map((data: any) => <Question[]>data),
      // tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }


  addQuestion(question: Question) {
    var q = {
      _id: question._id,
      questionText: question.questionText,
      timer: question.timer,
      imgUrl: question.imgUrl,
      displayOrder: question.displayOrder,
      columnsCount: question.columnsCount,
      isActive: question.isActive,
      questionTypeId: question.questionType,
      bookId:question.book._id,
      quizId: question.quiz,
      chapterId: question.chapter,
      answers: question.answers
    }

    return this.http.post(url + "questions", q).pipe(
      map((data: any) => <Question>data),
      // tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }

  updateQuestion(questionId: String, question: any) {
    var q = {
      _id: questionId,
      questionText: question.questionText,
      timer: question.timer,
      imgUrl: question.imgUrl,
      displayOrder: question.displayOrder,
      columnsCount: question.columnsCount,
      isActive: question.isActive,

      quizId: question.quiz,
      bookId: question.book._id,
      chapterId: question.chapter,
      questionTypeId: question.questionType,
      answers: question.answers
    }

    return this.http.put(url + "questions/" + questionId, q).pipe(
      map((data: Question) => <Question>data),
      // tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }

  deleteQuestion(questionId: string) {

    return this.http.delete(url + "questions/" + questionId).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let msg = `${error.error} Error status code ${error.status} at ${error.url}`;
    return throwError(msg);
  }


}
