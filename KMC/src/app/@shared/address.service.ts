import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, tap } from 'rxjs';
import { AccountAddresses } from '../models/accounts-addresses.model';
import {
  AddressesAction,
  DeleteAddressesAction,
  InsertAddressesAction,
  UpdateAddressesAction,
} from '../store/accounts/addresses/addresses-action';
import { HttpService } from './http/http.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(
    private http: HttpService,
    private store: Store<{ accountAddresses: AccountAddresses[] }>
  ) {}

  getAddresses() {
    return this.http.getReq('api/user/address/').pipe(
      take(1),
      tap((res: any) => {
        this.store.dispatch(new AddressesAction(res));
      })
    );
  }
  updateAddress(addressId: any, address: any) {
    return this.http.putReq(`api/user/address/${addressId}`, address).pipe(
      take(1),
      tap((res: any) => {
        // this.store.dispatch(new UpdateAddressesAction(res));
      })
    );
  }
  deleteAddress(addressId: any) {
    return this.http.deleteReq(`api/user/address/${addressId}`).pipe(
      take(1),
      tap((res: any) => {
        this.store.dispatch(new DeleteAddressesAction(addressId));
      })
    );
  }
  addNewAddress(data: any) {
    return this.http.postReq('api/user/address/', data).pipe(
      take(1),
      tap((res) => {
        // this.store.dispatch(new InsertAddressesAction(res))
      })
    );
  }
}
