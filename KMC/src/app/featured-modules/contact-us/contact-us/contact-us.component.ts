import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ContactUs } from 'src/app/models/contact-us.model';
// import { POSTContactUs} from 'src/app/models/contact-us.model';

import { ConatcUsAction } from 'src/app/store/contact-us/contact-us-action';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpService } from 'src/app/@shared/http/http.service';
import { imgUrl } from '../../../@shared/http/http.service';
import { CustomValidatorsService } from 'src/app/@shared/custom-validators.service';
import { CookieService } from 'ngx-cookie-service';
declare var UIkit: any;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit, OnDestroy {
  contactUsContent!: ContactUs;
  // POSTContactUs!:POSTContactUs
  private unSubscribe!: Subscription;
  contactUsForm!: FormGroup;
  isLoading: boolean = false;
  clicked: boolean = false;
  formSpineer: boolean = false;
  imgUrl = imgUrl;
  constructor(
    private store: Store<{ contactUs: ContactUs }>,
    private http: HttpService,
    private formB: FormBuilder,
    private customValidators: CustomValidatorsService,
    private cs: CookieService
  ) {}

  ngOnInit(): void {
    this.store.select('contactUs').subscribe((contactUs) => {
      this.contactUsContent = contactUs;
      if (!this.contactUsContent) {
        this.isLoading = true;
        this.unSubscribe = this.http
          .getReq('api/contact-us/')
          .subscribe((res: ContactUs) => {
            this.store.dispatch(new ConatcUsAction(res));
            this.isLoading = false;
          });
      }
    });
    this.getFormData();
  }

  get formContarols() {
    return this.contactUsForm.controls;
  }

  getFormData() {
    this.contactUsForm = this.formB.group(
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
          validators: [
            Validators.required,
            Validators.email,
            Validators.pattern(
              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
          ],
        }),
        phone: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required, Validators.pattern('[0-9]{11}')],
        }),
        subject: new FormControl(null, {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('[A-za-zء-ي\\s]{2,}'),
          ],
        }),
        message: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required, Validators.minLength(1)],
        }),
      },
      {
        validators: [this.customValidators.checkPhone('phone')],
      }
    );
  }

  sendData() {
    if (this.contactUsForm.invalid) {
      return;
    }
    this.clicked = true;
    this.formSpineer = true;
    this.http.postReq('api/contact-us/', this.contactUsForm.value).subscribe(
      (res) => {
        this.contactUsForm.reset();
        this.clicked = false;
        this.formSpineer = false;
        let message =
          this.cs.get('language') == 'en'
            ? 'Data has been sent'
            : 'تم ارسال البيانات بنجاج';
        UIkit.notification({
          message: message,
          status: 'success',
          pos: 'top-center',
          timeout: 3000,
        });
      },
      (error) => {
        this.clicked = false;
        this.formSpineer = false;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.unSubscribe) {
      this.unSubscribe.unsubscribe();
    }
  }
}

/** get form name and email etc.... */

/** function to set validatiors in contactus form.... */

/** function send req data to server .... */
