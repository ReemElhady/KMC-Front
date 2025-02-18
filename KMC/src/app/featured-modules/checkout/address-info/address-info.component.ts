import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription, startWith } from 'rxjs';
import { AddressService } from 'src/app/@shared/address.service';
import { CartService } from 'src/app/@shared/cart.service';
import { CustomValidatorsService } from 'src/app/@shared/custom-validators.service';
import { HttpService, imgUrl } from 'src/app/@shared/http/http.service';
import { AccountAddresses } from 'src/app/models/accounts-addresses.model';
import { CartItem, OrderSammary } from 'src/app/models/cart.model';
import {
  CountriesDataService,
  getCountryCodeName,
} from '../../account/account/addresses/countries-data.service';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.scss'],
  providers: [NgbModalConfig, NgbModal],
})
export class AddressInfoComponent implements OnInit, OnDestroy,AfterViewInit {
  isLoading = false;
  allAddresses!: AccountAddresses[];
  allAddressesSub!: Subscription;
  cartItems!: CartItem[];
  cartItemsSub!: Subscription;
  orderSummary!: OrderSammary;
  orderSummarySub!: Subscription;
  AddressesForm!: FormGroup;
  ourCountry: any;
  ourCity: any;
  smsaCities: { id: number; name: string }[] = [];
  clickedConfirm: boolean = false;
  selectedAddress!: any;
  id!: any;
  imgUrl = imgUrl;
  paymemtValues: any = ['Credit Card', 'Cash On Delivery'];
  paymentMethod: string = 'Credit Card';
  points: any = 0;
  pointValue: any = 0;
  pointsOptions: any = [];
  selectedPointes: any = 0;
  math = Math;
  generalSub!: Subscription;
  isLoadingSub!: Subscription;
  errorMsg: any;
  noCity: any;
  testForm!: FormGroup;
  shipingFees!: number;
  codFees!: number;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private addressService: AddressService,
    private store: Store<{
      accountAddresses: AccountAddresses[];
      cart: CartItem[];
      orderSummay: OrderSammary;
    }>,
    private formB: FormBuilder,
    private customValidators: CustomValidatorsService,
    public countriesService: CountriesDataService,
    private router: Router,
    private cartService: CartService,
    private http: HttpService
  ) {
    //keys country and keys city
    this.ourCountry = Object.keys(this.countriesService.ourCountries);
    this.ourCity = this.countriesService.ourCountries;
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.addressService.getAddresses().subscribe((res) => {
      this.allAddresses = res;
      this.getDefultAddress();
    });
    this.isLoading = true;
    this.pointsOptions = [];
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
            Validators.pattern('[A-za-zء-ي\\s]{2,}'),
          ],
        }),
        phone: new FormControl(null, {
          updateOn: 'change',
          validators: [
            this.customValidators.isPhone(getCountryCodeName('+20')),
            Validators.required,
          ],
        }),

        phone_country_code: new FormControl('+20', {
          updateOn: 'change',
          validators: [Validators.required],
        }),
        city: new FormControl(null, {
          updateOn: 'change',
          validators: [
            Validators.required,
            // Validators.pattern('[A-za-zء-ي\\s]{2,}'),
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
          validators: [Validators.required, Validators.pattern('[0-9]{1,}')],
        }),
        building: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required, Validators.pattern('[0-9]{1,}')],
        }),
        apartment: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required, Validators.pattern('[0-9]{1,}')],
        }),
        id: new FormControl(null),
      },
      {
        // validators: [this.customValidators.checkPhone('phone')],
      }
    );

    this.getCities();
    this.cartItemsSub = this.store.select('cart').subscribe((items) => {
      this.cartItems = items;
    });
    this.isLoadingSub = this.cartService.isLoading.subscribe((value) => {
      this.isLoading = value;
    });
    this.orderSummarySub = this.store
      .select('orderSummay')
      .subscribe((summary) => {
        this.orderSummary = summary;
        // if(!this.cartService.pointValue && !this.cartService.points){
        this.cartService.generalsObject.subscribe((res) => {
          if (res.pointValue) {
            this.pointValue = this.cartService.pointValue;
            this.addPoints();
          }
        });
        // }else{
        //   this.isLoading = false ;
        //   this.pointValue = this.cartService.pointValue
        //   this.addPoints()
        // }
      });

    this.testForm = new FormGroup({
      tt: new FormControl(null),
    });
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
  get formContarols() {
    return this.AddressesForm.controls;
  }
  // open model to use it in deleteAddresses
  addPoints() {
    this.points = Math.floor(this.cartService.points / 1000);
    this.pointsOptions = [];
    if (this.points >= 1 && !this.pointsOptions.length) {
      for (let i = 1; i <= this.points; i++) {
        if (
          this.math.floor(i * 1000 * this.pointValue) <=
          this.orderSummary.total_price
        ) {
          this.pointsOptions.push(i * 1000);
          continue;
        } else {
          this.pointsOptions.push(i * 1000);
          break;
        }
      }
    }
  }
  setSelectedPoints(value: any) {
    this.selectedPointes = value;
  }
  open(content: any, id: any = null) {
    if (!id) {
      this.id = null;
      this.AddressesForm.reset({
        country: 'Egypt',
        phone_country_code: '+20',
      });
    }
    this.modalService.open(content);
  }
  getcityValue(selectedId: any) {
    this.AddressesForm.get('city')?.setValue(selectedId);
  }
  // confirm
  // confirm() {
  //   if (this.AddressesForm.valid) {
  //     this.isLoading = true;
  //     this.clickedConfirm = true;
  //     let body = this.AddressesForm.value;
  //     if (body['last_name']) {
  //       body['name'] = `${body['first_name']} ${body['last_name']}`;
  //     } else {
  //       body['name'] = `${body['first_name']}`;
  //     }
  //     delete body['first_name'];
  //     delete body['last_name'];

  //     if (!this.id) {
  //       this.addressService.addNewAddress(body).subscribe(
  //         (res) => {
  //           this.isLoading = false;
  //           this.clickedConfirm = false;
  //           this.AddressesForm.reset();
  //           this.modalService.dismissAll();
  //           this.addressService.getAddresses().subscribe((res) => {
  //             // this.allAddresses.push(res);
  //           });
  //         },
  //         (error) => {
  //           this.errorMsg = this.http.handleAdressesError(error);
  //           this.isLoading = false;
  //           this.clickedConfirm = false;
  //         }
  //       );
  //     } else {
  //       this.addressService.updateAddress(this.id, body).subscribe(
  //         (res) => {
  //           this.isLoading = false;
  //           this.clickedConfirm = false;
  //           this.AddressesForm.reset();
  //           this.modalService.dismissAll();
  //           this.addressService.getAddresses().subscribe((res) => {});
  //           this.id = null;
  //         },
  //         (error) => {
  //           this.errorMsg = this.http.handleAdressesError(error);
  //           this.isLoading = false;
  //           this.clickedConfirm = false;
  //           this.id = null;
  //         }
  //       );
  //     }
  //   }
  // }
  confirm() {
    if (this.AddressesForm.valid) {
      this.isLoading = true;
      this.clickedConfirm = true;
      let body = this.AddressesForm.value;
      if (body['last_name']) {
        body['name'] = `${body['first_name']} ${body['last_name']}`;
      } else {
        body['name'] = `${body['first_name']}`;
      }
      delete body['first_name'];
      delete body['last_name'];
  
      if (!this.id) {
        this.addressService.addNewAddress(body).subscribe(
          (res) => {
            this.isLoading = false;
            this.clickedConfirm = false;
            this.AddressesForm.reset();
            this.modalService.dismissAll();
            this.addressService.getAddresses().subscribe((res) => {
              // Optionally, you could replace the `allAddresses` array with the response if needed
              // this.allAddresses = res;
            });
          },
          (error) => {
            this.errorMsg = this.http.handleAdressesError(error);
            this.isLoading = false;
            this.clickedConfirm = false;
          }
        );
      } else {
        this.addressService.updateAddress(this.id, body).subscribe(
          (res) => {
            this.isLoading = false;
            this.clickedConfirm = false;
            this.AddressesForm.reset();
            this.modalService.dismissAll();
            
            // Update the address in the local array
            this.allAddresses = this.allAddresses.map((address) =>
              address.id === this.id ? { ...address, ...body } : address
            );
  
            // If the updated address is selected, update it in the selectedAddress
            if (this.selectedAddress && this.selectedAddress.id === this.id) {
              this.selectedAddress = { ...this.selectedAddress, ...body };
            }
  
            this.id = null;
          },
          (error) => {
            this.errorMsg = this.http.handleAdressesError(error);
            this.isLoading = false;
            this.clickedConfirm = false;
            this.id = null;
          }
        );
      }
    }
  }
  
  //open modal update and create addresses
  openAddresses(content: any, index: any, id: any) {
    this.id = id;
    this.open(content, this.id);
    let check = false;
    if (this.allAddresses[index]) {
      check = true;
    }
    this.AddressesForm.patchValue({
      name: check ? this.allAddresses[index].name : '',
      phone: check ? this.allAddresses[index].phone : '',
      phone_country_code: check
        ? this.allAddresses[index].phone_country_code
        : '',
      country: check ? this.allAddresses[index].country : '',
      city: check ? this.allAddresses[index].city : '',
      address: check ? this.allAddresses[index].address : '',
      floor: check ? this.allAddresses[index].floor : '',
      apartment: check ? this.allAddresses[index].apartment : '',
      building: check ? this.allAddresses[index].building : '',
      id: this.id,
    });
  }
  // deleteAddress(addressId: any) {
  //   this.isLoading = true;
  //   this.addressService.deleteAddress(addressId).subscribe(
  //     (res) => {
  //       this.isLoading = false;
  //       if (this.selectedAddress) {
  //         if (this.selectedAddress.id == addressId) {
  //           this.selectedAddress = null;
  //           if (this.allAddresses.length > 0) {
  //             this.selectedAddress = this.allAddresses[0];
  //           }
  //         }
  //       }
  //       // Redirect to the desired page after successful deletion
  //       this.router.navigate(['/checkout/address']); 
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //     }
  //   );
  // }
  deleteAddress(addressId: any) {
    this.isLoading = true;
    this.addressService.deleteAddress(addressId).subscribe(
      (res) => {
        this.isLoading = false;
        
        // Remove the deleted address from the local array
        this.allAddresses = this.allAddresses.filter(
          (address) => address.id !== addressId
        );
        
        // Update the selected address if needed
        if (this.selectedAddress && this.selectedAddress.id === addressId) {
          this.selectedAddress = null;
          if (this.allAddresses.length > 0) {
            this.selectedAddress = this.allAddresses[0];
          }
        }
  
        // Redirect to the desired page after successful deletion
        this.router.navigate(['/checkout/address']); 
      },
      (error) => {
        this.isLoading = false;
        // Optionally, handle the error case if needed
      }
    );
  }
  
  getShipingFees() {
    console.log('triggered');
    if (this.paymentMethod === this.paymemtValues[1]) {
      console.log('triggered if');
      this.shipingFees =
        this.selectedAddress.shipping_details.shipping_cost +
        this.selectedAddress.shipping_details.cod_cost;
      this.codFees = this.selectedAddress.shipping_details.cod_cost;
    } else {
      console.log(this.selectedAddress);
      this.shipingFees = this.selectedAddress.shipping_details.shipping_cost;
      this.codFees = this.selectedAddress.shipping_details.cod_cost;
    }
  }
  getDefultAddress() {
    if (this.allAddresses && !this.selectedAddress)
      for (let i = 0; i < this.allAddresses.length; i++) {
        if (this.allAddresses[i].is_default) {
          this.selectedAddress = this.allAddresses[i];
          this.getShipingFees();
          break;
        }
      }
  }
  setSelectedAddress(address: AccountAddresses) {
    this.selectedAddress = address;
    this.getShipingFees();
  }
  continueCheckOut() {
    if (this.selectedAddress && this.paymentMethod) {
      this.router.navigate([
        '/checkout',
        'order',
        this.selectedAddress.id,
        this.paymentMethod,
        this.selectedPointes,
      ]);
    }
  }

  setCountryCode(country: string) {
    this.AddressesForm.get('phone_country_code')?.setValue(
      this.ourCity[country].code
    );
  }

  ngOnDestroy(): void {
    if (this.cartItemsSub) {
      this.cartItemsSub.unsubscribe();
    }

    if (this.orderSummarySub) {
      this.orderSummarySub.unsubscribe();
    }
    if (this.generalSub) {
      this.generalSub.unsubscribe();
    }
    if (this.isLoadingSub) {
      this.isLoadingSub.unsubscribe();
    }
  }
  // getCode() {
  //   this.AddressesForm.get('phone_country_code')
  //     ?.valueChanges.pipe(
  //       startWith(this.AddressesForm.get('phone_country_code')?.value)
  //     )
  //     .subscribe((res) => {
  //       console.log(res, 'abl');

  //       this.AddressesForm.get('phone')?.clearValidators();
  //       this.AddressesForm.get('phone')?.reset();
  //       this.AddressesForm.get('phone')?.addValidators([
  //         this.customValidators.isPhone(getCountryCodeName(res)),
  //         Validators.required,
  //       ]);
  //       console.log(res);
  //     });
  // }
}
