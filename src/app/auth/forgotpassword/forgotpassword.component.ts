import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  errorMsg: string = "";
  successMsg: string = "";
  email: FormControl = new FormControl("", [Validators.required]);
  sub: Subscription;
  isNewPassword: Boolean = false;
  setNewPasswordTitle: string = "";

  constructor(
    private authServices: AuthService,
    // @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { 

    if (this.router.getCurrentNavigation().extras.state) {
      this.isNewPassword = this.router.getCurrentNavigation().extras.state.setNewPassword;
      if (this.isNewPassword) {
        this.setNewPasswordTitle = "Set new password"
      }
    }

  }

  ngOnInit() {
    this.forgotPasswordForm = new FormGroup({
      email: this.email
    });
  }

  async resetPassword() {
    this.sub =await this.authServices.forgotPassword(this.email.value)
      .subscribe(
        data => {
          // this.spinner.hide();
          // this.router.navigate(["/login"]);
          // this.loginForm.reset();
          // this.toastr.success("Please check your email");
          this.errorMsg = "";
          this.successMsg = "Please check your email, you should get a reset passwrod link shortly";
        },
        err => {
          // this.spinner.hide();
          // this.toastr.error(err);
          this.successMsg = "";
          this.errorMsg = err;
        }
      );
  }

  ngOnDestroy() {
    if (!this.sub) return;
    this.sub.unsubscribe();
  }


}
