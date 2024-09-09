import { Action } from "@ngrx/store";
import { AccountAddresses} from '../../../models/accounts-addresses.model';
export const ADDRESSES = 'ADDRESSES'
export const UPDATE_ADDRESSES = 'UPDATE_ADDRESSES'
export const INSERT_ADDRESSES='INSERT_ADDRESSES'
export const DELETE_ADDRESSES='DELETE_ADDRESSES'
export const SETAS_DEFUALT_ADDRESSES='SETAS_DEFUALT_ADDRESSES'
export class AddressesAction implements Action {
  readonly type = ADDRESSES
  constructor(public payload: AccountAddresses[]|any) { }
}
export class UpdateAddressesAction implements Action{
readonly type= UPDATE_ADDRESSES
constructor(public payload: AccountAddresses) { }
}
export class InsertAddressesAction implements Action{
  readonly type= INSERT_ADDRESSES
  constructor(public payload: AccountAddresses) { }
  }
  export class DeleteAddressesAction implements Action{
    readonly type= DELETE_ADDRESSES
    constructor(public payload: number) { }
    }
    export class SetASDefualtAddressesAction implements Action{
      readonly type= SETAS_DEFUALT_ADDRESSES
      constructor(public payload: number) { }
      }
export  type addressesTypesActions= AddressesAction | UpdateAddressesAction |InsertAddressesAction |DeleteAddressesAction |SetASDefualtAddressesAction