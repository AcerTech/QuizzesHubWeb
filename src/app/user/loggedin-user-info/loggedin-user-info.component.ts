import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { User } from 'firebase';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-loggedin-user-info',
  templateUrl: './loggedin-user-info.component.html',
  styleUrls: ['./loggedin-user-info.component.css']
})
export class LoggedinUserInfoComponent implements OnInit, OnDestroy {
  userInfo: User;
  userForm: FormGroup;
  selectedImgUrl: String;
  sub: Subscription;
  errorMsg: string = "";

  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userInfo = this.authService.getCurrentUserInfo();
    this.createForm();
  }

  createForm() {
    this.userForm = this.fb.group({
      name: [this.userInfo['name'], [Validators.required, Validators.minLength(2)]],
      email: [this.userInfo['email'], [Validators.required, Validators.email]],
      imgUrl: [this.userInfo['imgUrl']],

    });
  }


  onSelectImage(imgUrl) {
    this.userForm.controls['imgUrl'].setValue(imgUrl);
    this.selectedImgUrl = imgUrl
  }

  async saveInfo() {
    this.errorMsg = "";
    const user = {
      name: this.userForm.get('name').value,
      email: this.userForm.get('email').value,
      imgUrl: this.userForm.get('imgUrl').value,
    };
    this.spinner.show()
    this.sub = await this.authService.updateUserInfo(this.userInfo['id'], user).subscribe(
      (data: any) => {
        this.spinner.hide();
        this.toastr.success('User info saved !')
      },
      (err: any) => {
        this.spinner.hide()
        this.toastr.error(err)
        this.errorMsg = err;
      }
    );
    this.spinner.hide();
  }


  changePasswordClicked() {
    let navExtras: NavigationExtras = {
      state: {
        setNewPassword: true
      }
    }
    //[routerLink]="['/forgotpassword']"
    this.router.navigate(['forgotpassword'], navExtras)
  }

  ngOnDestroy() {
    if (!this.sub) return;
    this.sub.unsubscribe();
  }
}
