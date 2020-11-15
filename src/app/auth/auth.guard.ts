import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) { }
  
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    const token = localStorage.getItem("userToken");
    if (token) {
      var roles = next.data["roles"] as Array<string>;

      if (roles) {
        var match = this.authService.roleMatch(roles);
        if (match) return true;
      } else {
        this.router.navigate(["/forbidden"]);
      }
    }

    this.router.navigate(["/login"]);
    return false;
  }
  
  
  
  

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return this.checkLoggedIn(state.url);
  // }

  // checkLoggedIn(url: string): boolean {
  //   if (this.authService.isLoggedIn()) {
  //     return true;
  //   }
  //   this.authService.redirectUrl = url
  //   this.router.navigate(['/login']);
  //   return false;
  // }


}
