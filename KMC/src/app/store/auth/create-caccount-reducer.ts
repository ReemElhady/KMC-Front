import { CreateAccount } from "src/app/models/auth-models";
import * as account from './create-account-action';



export let createAccount!: CreateAccount;

export function createAccountReducer(accState: CreateAccount = createAccount,
  action: account.createAccountAction): any {
  switch (action.type) {
    case account.CREATE_ACCOUNT:
      return {
        ...action.payload
      }

    default:
      return accState
  }

}
