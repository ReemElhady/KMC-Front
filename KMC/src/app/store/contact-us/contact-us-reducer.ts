import { ContactUs } from "src/app/models/contact-us.model";
import * as contactUsAction from "./contact-us-action";

export let contactUs!: ContactUs;


export function contactUsReducer(contactUsState: ContactUs = contactUs,
  action: contactUsAction.ConatcUsAction): any {
  switch (action.type) {
    case contactUsAction.CONTACT_US:
      return {
        ...action.payload
      }

    default:
      return contactUsState
  }

}
