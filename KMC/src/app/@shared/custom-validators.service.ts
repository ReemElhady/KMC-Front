import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import validator from 'validator';

@Injectable({
  providedIn: 'root',
})
export class CustomValidatorsService {
  constructor() {}

  checkPhone(phoneNum: string) {
    return (formGroup: FormGroup) => {
      const phone = formGroup.controls[phoneNum];
      if (phone.errors && !phone.errors['checkPhone']) {
        return;
      }
      if (phone.value.slice(0, 2) !== '01') {
        phone.setErrors({ checkPhone: true });
      } else {
        phone.setErrors(null);
      }
    };
  }
  checkPhoneCode(phoneNum: string, expectedCode: string) {
    console.log('in validation');

    return (formGroup: FormGroup) => {
      const phone = formGroup.controls[phoneNum];
      if (phone.errors && !phone.errors['invalidEgyptNumber']) {
        return;
      }
      if (expectedCode === '+20' && !phone?.value?.match(/^01\d{9}$/)) {
        console.log('in if ');
        phone.setErrors({ invalidEgyptNumber: true });
      } else {
        phone.setErrors(null);
        console.log('in if ');
      }
    };
  }
  mustMatch(controlName: string, matchingControlName: string) {
    return (fromGroup: FormGroup) => {
      const control = fromGroup.controls[controlName];
      const matchingControl = fromGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ MustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  // Check If Input Contains Valid Mobile Number
  isPhone(countryCode: any) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const value = control.value.trim() as string;
      if (value.slice(0, 2) !== '01') {
        return { notEgypt: true };
      }
      if (value && !validator.isMobilePhone(value, countryCode)) {
        return { notPhone: true };
      }
      return null;
    };
  }
}
