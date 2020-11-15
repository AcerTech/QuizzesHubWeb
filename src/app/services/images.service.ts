import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { Image } from '../models/interfaces';
import { AuthService } from './auth.service';
import { environment } from "../../environments/environment";
const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  addImage(image: Image) {
    // console.log(image)
    return this.http.post(url + "images", image).pipe(
      map((data: any) => <Image>data),
      // tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }

  getMyImages(userId): Observable<Image[]> {
    return this.http.get(url + "images/" + userId).pipe(
      map((data: any) => <Image[]>data),
      // tap(data => this.imagesData.push(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  searchImagesByTags(_searchTerm: string) {
    var searchTerm = {
      userId: this.authService.getCurrentUserId(),
      tags: _searchTerm
    }
    console.log(searchTerm)
    return this.http.post(url + "images/searchbytags", searchTerm).pipe(
      map((data: any) => <Image[]>data),
      // tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  deleteImage(imageId: string) {
    return this.http.delete(url + "images/" + imageId).pipe(
      catchError(this.handleError)
    );
  }

  deleteImageByUrl(imageUrl: string) {
    const img = {
      imgUrl: imageUrl.toString()
    }
    return this.http.post(url + "images/deleteByUrl", img).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // console.error(error);
    let msg = `${error.error} Error status code ${error.status} at ${error.error}`;
    return throwError(msg);
  }
}
