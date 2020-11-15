import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Grade } from '../models/interfaces';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { Observable, Subject, Subscription, throwError } from 'rxjs';
import { environment } from "../../environments/environment";
const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private grades$= new Subject<Grade[]>();


  constructor(private http: HttpClient) { }



  getGrades():Observable<Grade[]> {
    return this.http.get(url + "grades").pipe(
      map((data: any) => <Grade[]>data),
      // tap(data => this.gradesData.push(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // console.error(error);
    let msg = `${error.error} Error status code ${error.status} at ${error.error}`;
    return throwError(msg);
  }
}
