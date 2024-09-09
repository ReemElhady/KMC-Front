import { Action } from "@ngrx/store";
import { Home } from '../../models/home.model';


export const HOME = 'HOME'

export class HomeAction implements Action {
  readonly type = HOME
  constructor(public payload: Home) { }
}
