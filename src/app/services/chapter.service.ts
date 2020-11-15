import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { Chapter } from '../models/interfaces';
import { environment } from "../../environments/environment";
const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  private chaptersData: Chapter[] = []

  constructor(private http: HttpClient) { }

  // getChaptersData() {
  //   if (this.chaptersData) {
  //     this.getBookChapters()
  //   }
  //   return this.chaptersData
  // }


  addChapter(chapter) {
    return this.http.post(url + "chapters", chapter).pipe(
      map((data: any) => <Chapter>data),
      catchError(this.handleError)
    );
  }


  getChapters(bookId) {
    return this.http.get(url + "chapters/bookChapters/" + bookId).pipe(
      map((data: any) => <Chapter[]>data),
      tap(data => this.chaptersData = data),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  updateChapter(chapterId, chapter) {
    return this.http.put(url + "chapters/" + chapterId, chapter).pipe(
      map((data: Chapter) => <Chapter>data),
      catchError(this.handleError)
    );
  }



  deleteChpater(chapterId: string) {
    return this.http.delete(url + "chapters/" + chapterId).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    let msg = `${error.error} Error status code ${error.status} at ${error.error}`;
    return throwError(msg);
  }


}
