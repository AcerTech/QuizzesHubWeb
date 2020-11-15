import { Component, Input, OnInit } from '@angular/core';
import { auth } from 'firebase';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(public authServices: AuthService,) {
    this.isLoggedIn = this.authServices.isLoggedIn()
  }

  ngOnInit(): void {
  }

  logout() {
    this.authServices.logOut();
  }

}
