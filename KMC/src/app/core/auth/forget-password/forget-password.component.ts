import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidatorsService } from 'src/app/@shared/custom-validators.service';
import { HttpService } from 'src/app/@shared/http/http.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  resetPassword!: FormGroup;
  encrypted_id: string = '';

  constructor(
    private formB: FormBuilder,
    private customValidators: CustomValidatorsService,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.resetPassword = this.formB.group({
      new_password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6)]
      }),
      confirm_password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6)]
      })
    }, {
      validators: [
        this.customValidators.mustMatch('new_password', 'confirm_password')
      ]
    }
    )
    // this.resetPassword = new FormGroup({
    //   phone: new FormControl(null, {
    //     updateOn: 'change',
    //     validators: [Validators.required, Validators.email]
    //   }),
    // })
    this.route.params.subscribe(res => {
      this.encrypted_id = res['id']
    })
  }

  get formContarols() {
    return this.resetPassword.controls
  }

  resetUserPassword() {
    const body = {
      new_password: this.resetPassword.get('new_password')?.value,
      confirm_password: this.resetPassword.get('confirm_password')?.value,
      encrypted_id: this.encrypted_id
    }

    this.httpService.putReq('api/user/auth/reset-forget-password/',
      body).
      subscribe(res => {
        this.resetPassword.reset();
        this.router.navigate([''])
      }, error => {
        this.httpService.handleHttpError(error)
      })
  }
}
