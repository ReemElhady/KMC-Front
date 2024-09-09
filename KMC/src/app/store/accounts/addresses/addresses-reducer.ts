import { state } from "@angular/animations";
import { AccountAddresses } from "src/app/models/accounts-addresses.model";
import * as addressesAction from "../../accounts/addresses/addresses-action";
export let accountAddresses!: AccountAddresses[] | any;

function sortData(state: AccountAddresses[]) {
  state.sort(function (x: any, y: any) {
    return Number(y.is_default) - Number(x.is_default)
  })
}
export function addressesReducer(addressesState: AccountAddresses[] | any = accountAddresses,
  action: addressesAction.addressesTypesActions): any {
  switch (action.type) {
    case addressesAction.ADDRESSES:
      let addressesSort = [
        ...action.payload
      ]
      sortData(addressesSort)
      return addressesSort
    case addressesAction.UPDATE_ADDRESSES:
      let oldAddresses = [...addressesState]
      let newAddresses = oldAddresses.map(vlaue => {
        if (vlaue.id == action.payload.id) {
          return action.payload
        } else {
          return vlaue
        }
      })
      sortData(newAddresses)

      return newAddresses

    case addressesAction.INSERT_ADDRESSES:
      let insertAddresses = [...addressesState]
      insertAddresses.push(action.payload)
      sortData(insertAddresses)
      return insertAddresses;
    case addressesAction.DELETE_ADDRESSES:
      let deleteAddresses = addressesState.filter((value: any) => value.id != action.payload)
      if (deleteAddresses.length == 1) {
        deleteAddresses = [{ ...deleteAddresses[0], is_default: true }]
      }
      sortData(deleteAddresses)
      return deleteAddresses;
    case addressesAction.SETAS_DEFUALT_ADDRESSES:
      let setasDefultAddresses = addressesState.map((value: any) => {
        if (value.id == action.payload) {
          // value.is_default = true;
          return { ...value, is_default: true }
        } else {
          // value.is_default = false
          return { ...value, is_default: false }

        }
      }
      )
      sortData(setasDefultAddresses)

      return setasDefultAddresses;
    default:
      return addressesState
  }

}
