import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { User } from '../models/interfaces';
const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl: string;

  constructor(private http: HttpClient) { }

  login(email, password) {

    const userData = {
      email: email,
      password: password
    }

    return this.http.post(url + "auth", userData).pipe(
      map((data: any) => <any>data),
      tap(data => {
        // console.log(data);
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
      }),
      catchError(this.handleError)
    );
  }

  confirm(confirmationToken: any) {
    const confToken = {
      confirmationToken: confirmationToken
    }
    return this.http.post(url + "users/confirm", confToken).pipe(
      map((data: any) => <any>data),
      // tap(data => {
      //   // console.log(data);
      //   // localStorage.setItem("userToken", data.token);
      //   // localStorage.setItem("userInfo", JSON.stringify(userInfo));
      // }),
      catchError(this.handleError)
    );
  }

  resendConfirmation(email) {
    const E = {
      email:email
    }
    
    return this.http.post(url + "users/reconfirm", E).pipe(
      map((data: any) => <any>data),
      catchError(this.handleError)
    );
  }
  
  registerUser(user: any) {
    return this.http.post(url + "users", user).pipe(
      map((data: any) => <any>data),
      // tap(data => {
      //   // console.log(data);
      //   // localStorage.setItem("userToken", data.token);
      //   // localStorage.setItem("userInfo", JSON.stringify(userInfo));
      // }),
      catchError(this.handleError)
    );
  }


  updateUserInfo(userId, user) {
    console.log(userId)
    return this.http.post(url + "users/update-user-info/"+userId, user).pipe(
      map((data: any) => <any>data),
       tap(data => {
        // localStorage.setItem("userToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
      }),
      catchError(this.handleError)
    );
  }

  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo == null) return false;
    if (userInfo.role != null) {
      allowedRoles.forEach(element => {
        if (userInfo.role.indexOf(element) > -1) {
          isMatch = true;
          return false;
        }
      });
    }

    return isMatch;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("userToken");// to convert object ot boolean we use "!!" 
  }

  loggedinUserName() {
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo == null) return "";
    return userInfo.name;
  }

  getCurrentUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo;
  }

  getCurrentUserId() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo['id']

  }
  logOut() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
  }

  forgotPassword(email: any) {
    const body = {
      email: email
    }

    return this.http.post(url + "auth/forgotpassword", body).pipe(
      map((data: any) => <any>data),
      tap(data => {
        // console.log(data);
        // localStorage.setItem("userToken", data.token);
        // localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }),
      catchError(this.handleError)
    );
  }

  changePassword(newPassword, resetToken) {
    const body = {
      newPassword: newPassword,
      resetToken: resetToken
    }

    return this.http.post(url + "auth/reset-password", body).pipe(
      map((data: any) => <any>data),
      tap(data => {
        // console.log(data);
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
      }),
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    // console.error(error);
    let msg = `${error.error} Error status ${error.statusText} code ${error.status}`;
    return throwError(msg);
  }


}
