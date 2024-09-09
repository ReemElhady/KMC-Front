import { Action } from "@ngrx/store";
import { CreateAccount } from "src/app/models/auth-models";

export const CREATE_ACCOUNT = 'CREATE_ACCOUNT'

export class createAccountAction implements Action {
  readonly type = CREATE_ACCOUNT;
  constructor(public payload: CreateAccount) { }
}
