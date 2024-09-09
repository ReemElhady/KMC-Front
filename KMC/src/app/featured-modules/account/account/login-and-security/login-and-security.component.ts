import { Component, OnInit, ViewChild } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { CookieService } from 'ngx-cookie-service'
import { CustomValidatorsService } from 'src/app/@shared/custom-validators.service'
import { HttpService } from 'src/app/@shared/http/http.service'
import { LoginSecurity, UserToken } from 'src/app/models/login-security.model'
import {
  GetUserAction,
  UpdateLoginAction,
} from 'src/app/store/accounts/login-security/logi-security-action'
@Component({
  selector: 'app-login-and-security',
  templateUrl: './login-and-security.component.html',
  styleUrls: ['./login-and-security.component.scss'],
  // add NgbModalConfig and NgbModal to the component providers
  providers: [NgbModalConfig, NgbModal],
})
export class LoginAndSecurityComponent implements OnInit {
  userData!: LoginSecurity
  LoginForm!: FormGroup
  isLoading: boolean = false
  closeResult = ''
  ChangPasswordForm!: FormGroup
  clicked: boolean = false
  errorMsg: string = ''
  unSubscribe: any
  disabled: boolean = false
  otpForm!: FormGroup
  phone!: string
  errorMes: string = ''
  otpTimeer: number = 180
  resendText = false
  oldPhone: any
  peasserrorMsg: string = '';
  showPassword = false;
  passWordToggleIcon = 'eye';
  intervalNum: any;
  @ViewChild('verifyPhone', { static: false }) verifyPopup!: any

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private store: Store<{ accountLogin: LoginSecurity }>,
    private http: HttpService,
    private formB: FormBuilder,
    private customValidators: CustomValidatorsService,
    private cs: CookieService

  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static'
    config.keyboard = false
  }
  @ViewChild('openDialog', { static: false }) openBtn!: any;


  ngOnInit(): void {
    this.getAllData()
    this.initForm()
    this.http.phone.subscribe((res: any) => {
      if (res) {
        this.phone = res
      }
    })

  }
  //form validate for 3 forms [loginform,changpasswordform,otp to verify phone]
  initForm() {
    this.LoginForm = this.formB.group(
      {
        phone: new FormControl(this.userData ? this.userData.phone : '', {
          updateOn: 'change',
          validators: [Validators.pattern('[0-9]{6,}')],
        }),
        name: new FormControl(this.userData ? this.userData.name : '', {
          updateOn: 'change',
          validators: [Validators.pattern('[A-za-zء-ي\\s]{2,}')],
        }),
        email: new FormControl(this.userData ? this.userData.email : '', {
          updateOn: 'change',
          validators: [
            Validators.email,
            Validators.pattern(
              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            ),
          ],
        }),
      },
      {
        validators: [this.customValidators.checkPhone('phone')],
      },
    )
    this.ChangPasswordForm = this.formB.group(
      {
        old_password: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required],
        }),
        new_password: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirm_password: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      {
        validators: [
          this.customValidators.mustMatch('new_password', 'confirm_password'),
        ],
      },
    )
    this.otpForm = new FormGroup({
      otp1: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      otp2: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      otp3: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      otp4: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    })

  }
  //formcontrols for loginform
  get formContarols() {
    return this.LoginForm.controls
  }
  //formcontrols for changepassword
  get formContarolsPassword() {
    return this.ChangPasswordForm.controls
  }

  //get  user-data
  getAllData() {
    this.store.select('accountLogin').subscribe((accountLogin) => {
      this.userData = accountLogin
      if (!this.userData) {
        this.isLoading = true
        this.unSubscribe = this.http
          .getReq('api/user/account/')
          .subscribe((res: any) => {
            this.store.dispatch(new GetUserAction(res))
            this.initForm()
            this.oldPhone = this.userData.phone
            this.isLoading = false
          },
            (error) => {
              this.isLoading = false
            })
      }
    })
  }
  //post addresses to send your addresses
  updateData() {
    this.clicked = true
    this.http.putReq('api/user/account/', this.LoginForm.value).subscribe(
      (res: any) => {
        this.store.dispatch(new UpdateLoginAction(this.LoginForm.value))
        if (this.oldPhone != this.LoginForm.get('phone')?.value) {
          this.modalService.open(this.verifyPopup, { size: 'md' })
          clearInterval(this.intervalNum)
          this.otpTimeer = 180
          this.otpCountDown()
        }
        this.clicked = false
      },
      (error: any) => {
        if (error.status === 406) {
          let message = this.cs.get('language') === 'en' ? 'This Phone number is already registered' : 'رقم الهاتف هذا مسجل بالفعل'
          this.errorMsg = message;
        }
        else {
          let message = this.cs.get('language') === 'en' ? 'You have error here' : 'هناك حطأ ما'
          this.errorMsg = message
          this.clicked = false
        }

      },
    )
  }
  // open model to use it in deleteAddresses
  open(content: any) {
    this.modalService.open(content)
  }
  // button save chang disabled
  onChangForm() {
    const initialValue = this.LoginForm.value
    this.LoginForm.valueChanges.subscribe((value) => {
      this.disabled = Object.keys(initialValue).some(
        (key) => this.LoginForm.value[key] != initialValue[key],
      )

    })
  }

  //change password
  updatePassword() {

    this.clicked = true
    this.http
      .putReq('api/user/account/change-password', this.ChangPasswordForm.value)
      .subscribe(
        (res: any) => {

          this.modalService.dismissAll()
          this.ChangPasswordForm.reset()
          this.openBtn.nativeElement.click();
          this.clicked = false
        },
        (error: any) => {
          let message = this.cs.get('language') === 'en' ? 'Old password is incorrect' : 'كلمة السر القديمة غير صحيحه'
          this.peasserrorMsg = message
          this.clicked = false
        },
      )
  }
  //verfiy phone
  //verfiy method
  verfiy() {
    if (this.otpForm.invalid) {
      return
    }


    let otpKey = ''
    for (let i = 1; i <= 4; i++) {
      otpKey += this.otpForm.value['otp' + i]
    }

    const body = {
      code: otpKey,
      phone: this.userData.phone,
    }

    this.http.patchReq('api/user/account/', body).subscribe(
      (res) => {
        this.modalService.dismissAll()
      },
      (error) => {
        this.errorMes = this.http.handleHttpError(error)
      },
    )
  }
  //verfiy move with input
  move(
    event: any,
    previousNumber: any,
    currentNumber: any,
    nextNumber: any,
    index: any,
  ) {
    let length = currentNumber.value.length
    index = 'otp' + index
    this.otpForm.get(index)?.setValue(currentNumber.value)
    if (this.otpForm.valid) {
    }
    let maxLength = 1
    if (length === maxLength) {
      if (nextNumber !== '') {
        nextNumber.focus()
      }
    }
    if (event.key === 'Backspace') {
      if (previousNumber !== '') {
        previousNumber.focus()
      }
    }
  }
  //verfiy countdown
  otpCountDown() {
    this.intervalNum = setInterval(() => {
      this.otpTimeer = this.otpTimeer - 1
      if (this.otpTimeer <= 0) {
        clearInterval(this.intervalNum)
        // clearInterval(interval)
        this.resendText = true
      }
    }, 1000)
  }
  //resend code
  resend() {
    this.otpTimeer = 180
    this.resendText = false
    this.otpCountDown()
    const phone = {
      phone: this.oldPhone,
    }
    this.http.putReq('api/user/auth/resend-otp/', phone).subscribe(
      (res) => {

      },
      (error) => {
        this.errorMes = this.http.handleHttpError(error)
      },
    )
  }
  //icon showpassword and hise
  togglePassword(type: string) {
    if (type === 'password') {
      this.showPassword = !this.showPassword;
      if (this.passWordToggleIcon === 'fa-eye-slash') {
        this.passWordToggleIcon = 'fa-eye';
      }
      else {
        this.passWordToggleIcon = 'fa-eye-slash';
      }
    }

  }
}
