import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { StoreTokenActions } from 'src/app/store/auth/auth-action';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { HttpService } from 'src/app/@shared/http/http.service';
import { ShareVariablesService } from 'src/app/@shared/services/share-variables.service';
import { CreateAccount, JWTToken } from 'src/app/models/auth-models';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-verfiy',
  templateUrl: './verfiy.component.html',
  styleUrls: ['./verfiy.component.scss'],
})
export class VerfiyComponent implements OnInit, OnDestroy {
  otpForm!: FormGroup;
  phone: string = localStorage.getItem('phone') || '';
  password: string = localStorage.getItem('password') || '';
  errorMes: string = '';

  resendText = false;
  img: string = localStorage.getItem('img') || '';
  intervalId: any;
  destroy$ = new Subject<void>();
  intervalCount = 0;
  verified = false;

  timer = localStorage.getItem('otpTimeer') || '60';
  isPageReloaded: boolean =
    (window.performance.navigation &&
      window.performance.navigation.type === 1) ||
    window.performance
      .getEntriesByType('navigation')
      .map((nav) => nav.entryType)
      .includes('reload');
  qrCodeLink: string = localStorage.getItem('qr-code') || '';

  otpTimeer: number = 60;
  constructor(
    private httpService: HttpService,
    private cookieService: CookieService,
    private router: Router,
    private store: Store<{ data: CreateAccount }>,
    private shareVariables: ShareVariablesService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    localStorage.setItem('otpTimeer', '60');
    clearInterval(this.intervalId);
  }

  ngOnInit(): void {
    this.otpTimeer = parseInt(this.timer);
    this.intervalId = setInterval(() => {
      this.intervalCount++;
      if (this.intervalCount > 20) {
        clearInterval(this.intervalId);
      }

      this.httpService
        .getReq(`api/user/auth/check-user/${this.phone}/`)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res.is_active === true) {
            this.router.navigate(['auth', 'verify-success']);
            this.verified = true;
            clearInterval(this.intervalId);
            localStorage.setItem('token', res.token);

            this.httpService
              .postReq('api/token/', {
                phone: this.phone,
                password: this.password,
              })
              .subscribe((res) => {
                let tokenInfo: JWTToken = jwt_decode(res.access);
                this.httpService.userName.next(tokenInfo['name']);
                localStorage.setItem('userName', tokenInfo['name']);

                this.cookieService.set('token', res.access, { path: '/' });
                this.cookieService.set('refresh', res.refresh, { path: '/' });
                this.store.dispatch(new StoreTokenActions(res));
                this.httpService.isAuthenticated = true;
              });
          }
        });
    }, 5000);

    this.httpService.phone.subscribe((res) => {
      if (res) {
        this.phone = res;
      }
    });
    this.httpService.password.subscribe((res) => {
      this.password = res;
    });
    if (this.cookieService.get('phone')) {
      this.phone = this.cookieService.get('phone');
    }
    this.otpCountDown();
  }
  timerMethod() {
    this.otpTimeer = parseInt(this.timer);
  }
  verfiy() {
    // if (this.otpForm.invalid) {
    //   return;
    // }
    // if (!this.phone) {
    //   this.phone = this.cookieService.get('phone');
    // }
    // let otpKey = '';
    // for (let i = 1; i <= 4; i++) {
    //   otpKey += this.otpForm.value['otp' + i];
    // }
    // const body = {
    //   code: otpKey,
    //   phone: this.phone,
    // };
  }

  move(
    event: any,
    previousNumber: any,
    currentNumber: any,
    nextNumber: any,
    index: any
  ) {
    let length = currentNumber.value.length;
    index = 'otp' + index;
    this.otpForm.get(index)?.setValue(currentNumber.value);
    if (this.otpForm.valid) {
      // this.sendCode();
    }
    let maxLength = 1;
    if (length === maxLength) {
      if (nextNumber !== '') {
        nextNumber.focus();
      }
    }
    if (event.key === 'Backspace') {
      if (previousNumber !== '') {
        previousNumber.focus();
      }
    }
  }

  otpCountDown() {
    if (this.otpTimeer > 0) {
      let interval = setInterval(() => {
        this.timer = localStorage.getItem('otpTimeer')!;
        // this.timerMethod();
        this.otpTimeer = this.otpTimeer - 1;
        if (this.otpTimeer >= 0) {
          localStorage.setItem('otpTimeer', JSON.stringify(this.otpTimeer));
        }
        if (this.otpTimeer === 0 && this.verified === false) {
          clearInterval(interval);
        }
      }, 1000);
    }
  }

  resend() {
    this.httpService
      .getReq('api/user/auth/regenerate-qrcode/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.img = res.QR;
        this.qrCodeLink = res.Clickable;
      });
    if (this.otpTimeer === 0) {
      this.otpTimeer = 60;
      this.otpCountDown();
      const phone = {
        phone: this.phone,
      };
      this.httpService.putReq('api/user/auth/resend-otp/', phone).subscribe(
        (res) => {
          this.otpForm.reset();
        },
        (error) => {
          this.errorMes = this.httpService.handleHttpError(error);
        }
      );
    }
  }
}
