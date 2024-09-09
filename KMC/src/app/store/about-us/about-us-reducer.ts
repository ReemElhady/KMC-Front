import { AboutUs } from '../../models/about-us.model';
import * as aboutUsActions from "./about-us-action";


export let aboutUs!: AboutUs


export function aboutUsReducer(aboutnState: AboutUs = aboutUs,
   action: aboutUsActions.StoreAboutActions): any {
  switch (action.type) {
    case aboutUsActions.ABOUT_US:
      return {
        ...action.payload
      }

    default:
      return aboutnState
  }
}
