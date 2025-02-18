import { Component, OnInit , AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, startWith } from 'rxjs';
import { CustomValidatorsService } from 'src/app/@shared/custom-validators.service';
import { HttpService } from 'src/app/@shared/http/http.service';
import { AccountAddresses } from 'src/app/models/accounts-addresses.model';
import {
  AddressesAction,
  DeleteAddressesAction,
  InsertAddressesAction,
  SetASDefualtAddressesAction,
  UpdateAddressesAction,
} from 'src/app/store/accounts/addresses/addresses-action';
import {
  CountriesDataService,
  getCountryCodeName,
} from './countries-data.service';


@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
  providers: [NgbModalConfig, NgbModal],
})
export class AddressesComponent implements OnInit , AfterViewInit {
  AddressesContent!: any;
  AddressesForm!: FormGroup;
  isLoading: boolean = false;
  clicked: boolean = false;
  unSubscribe: any;
  ourCountry: any;
  ourCity: any;
  id!: number;
  isEmpaty: boolean = true;
  errorMsg: any;
  errorMsgCountry: string = '';
  errorMsgCity: string = '';
  disabledBool: boolean = false;
  smsaCities: { id: number; name: string }[] = [];

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private store: Store<{ accountAddresses: AccountAddresses[] }>,
    private http: HttpService,
    public countriesService: CountriesDataService,
    private formB: FormBuilder,
    private customValidators: CustomValidatorsService
  ) {
    //keys country and keys city
    this.ourCountry = Object.keys(this.countriesService.ourCountries);
    this.ourCity = this.countriesService.ourCountries;
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.getAllData();
    this.getFormData();
    this.onChangForm();
    this.getCities();
  }
  ngAfterViewInit(): void {
    // Listen for modal open event
    this.modalService.activeInstances.subscribe(() => {
      setTimeout(() => {
        this.applyModalStyle();
      }, 100); // Small delay to ensure modal is fully rendered
    });
  }

  applyModalStyle() {
    const modalElement = document.querySelector('.modal-content') as HTMLElement;
    if (modalElement) {
      modalElement.style.backgroundColor = '#666'; // Set background color
      modalElement.style.color = 'white'; // Change text color if needed
    }
  }
  
  getCities() {
    this.http.getReq('api/smsa/zone-cities/').subscribe((res) => {
      this.smsaCities = res;
    });
  }
  // open model to use it in deleteAddresses
  open(content: any, id = null) {
    if (id) {
      this.id = id;
    }
    this.modalService.open(content);
  }
  //formcontrols
  get formContarols() {
    return this.AddressesForm.controls;
  }
  // formLogin validation
  getFormData() {
    this.AddressesForm = this.formB.group(
      {
        first_name: new FormControl('', {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('[A-za-zء-ي\\s]{2,}'),
          ],
        }),
        last_name: new FormControl('', {
          updateOn: 'change',
          validators: [Validators.pattern('[A-za-zء-ي\\s]{2,}')],
        }),
        country: new FormControl('Egypt', {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('[A-za-zء-ي\\s\\0-9]{2,}'),
          ],
        }),
        phone: new FormControl(null, {
          updateOn: 'change',
          validators: [
            Validators.required,
            // this.customValidators.isPhone(this.getCode()),
            // this.customValidators.isPhone
            // countryCodeValidator(
            //   '+20'
            // ),
          ],
          // Validators.pattern('[0-9]{11}')
        }),
        phone_country_code: new FormControl('+20', {
          updateOn: 'change',
          validators: [Validators.required],
        }),
        city: new FormControl(null, {
          updateOn: 'change',
          validators: [
            Validators.required,
            // Validators.pattern('[A-za-zء-ي\\s\\0-9]{2,}'),
          ],
        }),
        address: new FormControl(null, {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('[A-za-zء-ي\\s\\0-9]{2,}'),
          ],
        }),
        floor: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.pattern('[0-9]{1,}')],
        }),
        building: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required, Validators.pattern('[0-9]{1,}')],
        }),
        apartment: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.pattern('[0-9]{1,}')],
        }),
      },
      {
        // validators: [this.customValidators.checkPhone('phone')],
        // validators: [this.customValidators.checkPhoneCode('phone','phone_country_code')],
      }
    );
    this.getCode();
  }

  //get addresses
  getAllData() {
    this.isLoading = false;
    this.store.select('accountAddresses').subscribe((accountAddresses) => {
      this.AddressesContent = accountAddresses;
      if (!this.AddressesContent) {
        this.isLoading = true;
        this.unSubscribe = this.http
          .getReq('api/user/address/')
          .subscribe((res: any) => {
            this.store.dispatch(new AddressesAction(res));
            this.isLoading = false;
          });
      }
    });
  }

  //delete expenses
  deleteAddresses() {
    this.http.deleteReq(`api/user/address/${this.id}`).subscribe(
      (res: any) => {
        this.store.dispatch(new DeleteAddressesAction(this.id));
        this.modalService.dismissAll();
      },
      (error: any) => {
        this.errorMsg = 'YOU HAVE ERROR HERE';
      }
    );
  }

  //open modal update and create addresses
  openAddresses(content: any, index: any, id: any) {
    this.id = id;
    this.open(content);
    let check = false;
    if (this.AddressesContent[index]) {
      check = true;
      this.isEmpaty = false;
      this.AddressesForm.patchValue({
        name: check ? this.AddressesContent[index].name : '',
        phone: check ? this.AddressesContent[index].phone : '',
        phone_country_code: check
          ? this.AddressesContent[index].phone_country_code
          : '',
        country: check ? this.AddressesContent[index].country : '',
        city: check ? this.AddressesContent[index].city : '',
        address: check ? this.AddressesContent[index].address : '',
        floor: check ? this.AddressesContent[index].floor : '',
        apartment: check ? this.AddressesContent[index].apartment : '',
        building: check ? this.AddressesContent[index].building : '',
      });
    } else {
      this.AddressesForm?.reset({
        phone_country_code: '+20',
        country: 'Egypt',
      });
      this.isEmpaty = true;
    }
  }

  //set addresses defult
  setDefult(id: number) {
    this.http.patchReq(`api/user/address/${id}`, {}).subscribe(
      (res: any) => {
        this.store.dispatch(new SetASDefualtAddressesAction(id));
      },
      (error: any) => {}
    );
  }

  confirm(id: any) {
    id = this.id;
    let addressObs: Observable<AccountAddresses>;
    let body = this.AddressesForm.value;
    if (body['last_name']) {
      body['name'] = `${body['first_name']} ${body['last_name']}`;
    } else {
      body['name'] = `${body['first_name']}`;
    }

    delete body['first_name'];
    delete body['last_name'];
    if (this.isEmpaty) {
      addressObs = this.http.postReq('api/user/address/', body);
    } else {
      addressObs = this.http.putReq(`api/user/address/${id}`, body);
    }
    addressObs.subscribe(
      (res) => {
        if (this.isEmpaty) {
          this.store.dispatch(new InsertAddressesAction(res));
        } else {
          this.store.dispatch(new UpdateAddressesAction(res));
        }
        this.clicked = false;
        this.AddressesForm.reset();
        this.modalService.dismissAll();
        // this.getAllData()
      },
      (error: any) => {
        this.errorMsg = this.http.handleAdressesError(error);
        this.clicked = false;
      }
    );
  }
  //change
  onChangForm() {
    const initialValue = this.AddressesForm.value;
    this.AddressesForm.valueChanges.subscribe((value) => {
      this.disabledBool = Object.keys(initialValue).some(
        (key) => this.AddressesForm.value[key] != initialValue[key]
      );
    });
  }
  setCountryCode(country: string) {
    this.AddressesForm.get('phone_country_code')?.setValue(
      this.ourCity[country].code
    );
  }
  //ngdestory unsubscripe
  ngOnDestroy(): void {
    if (this.unSubscribe) {
      this.unSubscribe.unsubscribe();
    }
  }
  getCode() {
    this.AddressesForm.get('phone_country_code')
      ?.valueChanges.pipe(
        startWith(this.AddressesForm.get('phone_country_code')?.value)
      )
      .subscribe((res) => {
        this.AddressesForm.get('phone')?.clearValidators();
        this.AddressesForm.get('phone')?.reset();
        this.AddressesForm.get('phone')?.addValidators([
          this.customValidators.isPhone(getCountryCodeName(res)),
          Validators.required,
        ]);
      });
  }
}
