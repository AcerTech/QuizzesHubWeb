import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/interfaces';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  errorMsg: string = "";
  msg: string;
  sub: Subscription;
  alert: Boolean = false;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      // userName: [null, [Validators.required]],
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      /*
      At least 6 characters in length
      Lowercase letters
      Uppercase letters
      Numbers
      Special characters
      */
      password: [null, [Validators.required, Validators.minLength(6), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{5,}')]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{5,}')]],

    }, {
      validator: this.checkPasswords
    });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true }
  }

  async register() {
    this.errorMsg = "";
    const user = {
      name: this.registerForm.get('name').value,
      email: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value,
    };
    this.sub = await this.authService.registerUser(user)
      .subscribe(
        data => {
          this.alert = true;
          this.registerForm.reset({})
        },
        error => (this.errorMsg = error),
      );


  }


  isInputValid(ctrl) {
    // const isValid = this.loginForm.controls.email.valid == true
    // const isInvalid = this.loginForm.controls.email.invalid == true
    const isValid = ctrl.valid == true
    const isInvalid = ctrl.invalid == true
    return { 'is-valid': isValid, 'is-invalid': isInvalid }
  }

  ngOnDestroy() {
    if (!this.sub) return;
        this.sub.unsubscribe();
  }

}
