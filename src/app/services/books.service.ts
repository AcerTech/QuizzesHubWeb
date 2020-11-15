import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { Book } from '../models/interfaces';

import { environment } from "../../environments/environment";
import { catchError, map, shareReplay } from 'rxjs/operators';
import { AuthService } from './auth.service';

const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private books$ = new Subject<Book[]>();


  constructor(private http: HttpClient, private authService: AuthService) { }

  storeSelectedBookToLocalStorage(selectedBook) {
    localStorage.setItem('selectedBook', JSON.stringify(selectedBook))
  }
  
  getSelectedBookFromLocalStorage() {
    return localStorage.getItem('selectedBook');
  }

  getMyBooks(userId) {
    return this.http.get(url + "books/mybooks/" + userId).pipe(
      map((data: any) => <Book[]>data),
      // tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }


  addBook(book: Book) {
    const userId = this.authService.getCurrentUserId()
    book['userId'] = userId
    return this.http.post(url + "books", book).pipe(
      map((data: any) => <Book>data),
      // tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }


  updateBook(bookId,book) {
    // console.log(book)
    const userId = this.authService.getCurrentUserId();
    book['userId'] = userId
    const b = {
      title: book.title,
      description: book.description,
      imgUrl: book.imgUrl,
      tags: book.tags,
      userId: userId,
      isActive: book.isActive
    }

    return this.http.put(url + "books/" + bookId, b).pipe(
      map((data: Book) => <Book>data),
      // tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }


  deleteBook(bookId: string) {
    return this.http.delete(url + "books/" + bookId).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    // console.error(error);
    let msg = `${error.error} Error status code ${error.status} at ${error.error}`;
    return throwError(msg);
  }
}