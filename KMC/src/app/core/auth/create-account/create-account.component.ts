import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { CustomValidatorsService } from 'src/app/@shared/custom-validators.service';
import { HttpService } from 'src/app/@shared/http/http.service';
import { ShareVariablesService } from 'src/app/@shared/services/share-variables.service';
import { CreateAccount } from 'src/app/models/auth-models';
import { createAccountAction } from 'src/app/store/auth/create-account-action';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  createAccountForm!: FormGroup;
  isLoading: boolean = false;
  formsLoading: boolean = false;
  errorMsg: string = '';
  img: string = '';
  phone: string = '';
  qrCodeLink: string = '';

  constructor(
    private customValidators: CustomValidatorsService,
    private formB: FormBuilder,
    // private htpp: HttpClient
    private httpService: HttpService,
    private router: Router,
    private store: Store<{ data: CreateAccount }>,
    private cookieService: CookieService,
    private shareVariables: ShareVariablesService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  // create account form
  createForm() {
    this.createAccountForm = this.formB.group(
      {
        name: new FormControl(null, {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('[A-za-zء-ي\\s]{2,}'),
          ],
        }),
        email: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required, Validators.email],
        }),
        phone: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required, Validators.pattern('[0-9]{11}')],
        }),
        password: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required, Validators.minLength(6)],
        }),
        re_password: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      {
        validators: [
          this.customValidators.mustMatch('password', 're_password'),
          this.customValidators.checkPhone('phone'),
        ],
      }
    );
  }
  // all form controls
  get formContarols() {
    return this.createAccountForm.controls;
  }

  createUser() {
    if (this.createAccountForm.invalid) {
      return;
    }
    this.formsLoading = true;

    this.httpService
      .postReq('api/user/auth/register/', this.createAccountForm.value)
      .subscribe(
        (res) => {
          this.formsLoading = false;
          this.store.dispatch(new createAccountAction(res));
          this.cookieService.set(
            'phone',
            this.createAccountForm.value['phone']
          );
          this.httpService.phone.next(this.createAccountForm.value['phone']);
          this.httpService.password.next(
            this.createAccountForm.value['password']
          );
          localStorage.setItem('phone', this.createAccountForm.value['phone']);
          localStorage.setItem(
            'password',
            this.createAccountForm.value['password']
          );
          // console.log(this.img);
          this.router.navigate(['auth', 'verfiy']);
          this.createAccountForm.reset();
          // this.store.select('data').subscribe((data) => {

          // });
          localStorage.setItem('img', res.wasage_response.QR);
          localStorage.setItem('phone', res.user.phone);
          localStorage.setItem('qr-code', res.wasage_response.Clickable);
          this.shareVariables.setImg((this.img = res.wasage_response.QR));
          this.shareVariables.setPhone((this.phone = res.user.phone));
          this.shareVariables.setLink(
            (this.qrCodeLink = res.wasage_response.Clickable)
          );
        },
        (error) => {
          this.formsLoading = false;
          this.errorMsg = this.httpService.handleHttpError(error);
        }
      );
  }
}
