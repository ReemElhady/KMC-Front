import { Action } from "@ngrx/store";
import { TokensModel } from "src/app/models/auth-models";

export const STROE_TOKEN = 'STROE_TOKEN'
export const UPDATE_TOKEN = 'UPDATE_TOKEN'

export class StoreTokenActions implements Action {
  readonly type = STROE_TOKEN;
  constructor(public payload: TokensModel|undefined) { }
}
export class UpdateTokenActions implements Action {
  readonly type = UPDATE_TOKEN;
  constructor(public payload: TokensModel) { }
}
export type TokenActionsTypes = StoreTokenActions | UpdateTokenActions;
