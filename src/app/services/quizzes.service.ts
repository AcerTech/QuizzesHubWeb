import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { Observable, Subject, Subscription, throwError } from 'rxjs';
import { environment } from "../../environments/environment";
import { Quiz } from '../models/interfaces';
const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class QuizzesService {
  constructor(private http: HttpClient) { }



  getQuizzes(): Observable<Quiz[]> {
    return this.http.get(url + "quizzes").pipe(
      map((data: any) => <Quiz[]>data),
      // tap(data => this.gradesData.push(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  addQuiz(quiz) {

    return this.http.post(url + "quizzes", quiz).pipe(
      map((data: any) => <Quiz>data),
      // tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }


  updateQuiz(quizId, quiz) {

    return this.http.put(url + "quizzes/" + quizId, quiz).pipe(
      map((data: Quiz) => <Quiz>data),
      // tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }


  deleteQuiz(quizId: string) {
    return this.http.delete(url + "quizzes/" + quizId).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // console.error(error);
    let msg = `${error.error} Error status code ${error.status} at ${error.error}`;
    return throwError(msg);
  }




}
