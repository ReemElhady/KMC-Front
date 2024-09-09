import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidatorsService } from 'src/app/@shared/custom-validators.service';
import { HttpService } from 'src/app/@shared/http/http.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPassword!: FormGroup;
  userMsg: boolean = false;
  isLoading = false

  constructor(
    private formB: FormBuilder,
    private customValidators: CustomValidatorsService,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.resetPassword = this.formB.group({
      phone: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.pattern('[0-9]{11}')]
      }),
    }, {
      validators: [
        this.customValidators.checkPhone('phone')
      ]
    }
    )
  }
  get formContarols() {
    return this.resetPassword.controls
  }
  resetUserPassword() {
    this.isLoading = true;
    this.httpService.postReq('api/user/auth/reset-forget-password/',
      this.resetPassword.value).
      subscribe(res => {
        this.isLoading = false;
        this.userMsg = true;
        this.resetPassword.reset();
      }, error => {
        this.isLoading = false;
        this.httpService.handleHttpError(error)
      })
  }

}
