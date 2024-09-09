import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from 'src/app/@shared/cart.service';
import { CustomValidatorsService } from 'src/app/@shared/custom-validators.service';
import { HttpService } from 'src/app/@shared/http/http.service';
import { JWTToken, TokensModel } from 'src/app/models/auth-models';
import { StoreTokenActions } from 'src/app/store/auth/auth-action';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  test!: any;
  errorMsg: string = '';
  isLoading = false;
  errors!: any;

  constructor(
    private formB: FormBuilder,
    private store: Store<{ tokens: TokensModel }>,
    private customValidators: CustomValidatorsService,
    private httpService: HttpService,
    private cService: CookieService,
    private router: Router,
    private cartService: CartService

  ) { }

  ngOnInit(): void {
    this.loginForm = this.formB.group({
      phone: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required,
        Validators.pattern('[0-9]{11}')
        ]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6)]

      }),
    }, {
      validators: [
        this.customValidators.checkPhone('phone')
      ]
    }
    )

    this.store.select("tokens").subscribe(tokens => {
      this.test = tokens;
    })

  }

  get formContarols() {
    return this.loginForm.controls
  }


  login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.httpService.postReq('api/token/', this.loginForm.value).
      subscribe((res) => {
        let tokenInfo: JWTToken = jwt_decode(res.access);
        this.httpService.userName.next(tokenInfo['name']);
        localStorage.setItem('userName', tokenInfo['name']);
        this.cService.set('token', res.access, { path: '/' })
        this.cService.set('refresh', res.refresh, { path: '/' })
        this.store.dispatch(new StoreTokenActions(res))
        this.loginForm.reset();
        this.httpService.isAuthenticated = true;
        this.isLoading = false;
        this.cartService.general().subscribe(res => {})
        if (this.cartService.getOrCreateCart().length) {
          this.cartService.sendGuestItems()?.subscribe(res => {
            this.cartService.getCartItemsBack().subscribe(res => {
            })
          }, errors => {
            this.cartService.getCartItemsBack().subscribe(res => {
            })
          })
        } else {
          this.cartService.getCartItemsBack().subscribe(res => {
          })

        }
        this.router.navigate([''])

      },
        error => {
          this.isLoading = false;
          this.errorMsg = this.httpService.handleHttpError(error)
        }
      )

    // this.http.post<TokensModel>('http://172.104.159.239:8011/api/token/', this.loginForm.value).
    //   subscribe(res => {
    //     this.store.dispatch(new StoreTokenActions(res))
    //   },
    //     error => {
    //     }
    //   )
    

  }
  password!: string;
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordField = document.getElementById('password') !;
    if (this.showPassword) {
      passwordField.setAttribute('type', 'text');
    } else {
      passwordField.setAttribute('type', 'password');
    }
  }
}
