import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit, OnDestroy {
  resendForm: FormGroup;
  confirmationToken: any;
  errorMsg: string;
  errorAlert: Boolean = false;
  successAlert: Boolean = false;
  confirmed: boolean = false;
  successMsg: string = "";
  sub: Subscription;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private authServices: AuthService) { }

  ngOnInit(): void {
    this.confirmationToken = this.route.snapshot.params['confirmationToken'];
    if (!this.confirmationToken) return;

    this.submitConfirmationToken();
    this.createForm();
  }

  createForm() {
    this.resendForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  async submitConfirmationToken() {
    this.sub = await this.authServices.confirm(this.confirmationToken)
      .subscribe(
        data => {
          this.successAlert = true;
          this.successMsg = "Thanks for confirming your account, you can login now !"
          this.confirmed = true;
          this.errorMsg = ""
          // this.registerForm.reset({})
        },
        error => {
          this.errorMsg = error;
          this.errorAlert = true;
        },
      );
  }

  ngOnDestroy() {
    if (!this.sub) return;
    this.sub.unsubscribe();
  }

  async resend() {
    const email = this.resendForm.get('email').value;

    this.sub = await this.authServices.resendConfirmation(email)
      .subscribe(
        data => {
          this.successAlert = true;
          this.errorMsg = ""
          this.successMsg = "Please check your email to confirm your account !"
          // this.registerForm.reset({})
        },
        error => {
          this.errorMsg = error;
          this.errorAlert = true;
        },
      );
  }

}
