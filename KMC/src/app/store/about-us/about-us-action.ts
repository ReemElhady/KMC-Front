import { Action } from "@ngrx/store";
import { AboutUs } from "src/app/models/about-us.model";

export const ABOUT_US = 'ABOUT_US'

export class StoreAboutActions implements Action {
  readonly type = ABOUT_US;
  constructor(public payload: AboutUs) { }
}
