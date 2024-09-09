import { Action } from '@ngrx/store';
import { ContactUs } from '../../models/contact-us.model';

export const CONTACT_US = 'UPDATE_TOKEN';

export class ConatcUsAction implements Action {
  readonly type = CONTACT_US;
  constructor(public payload: ContactUs) {}
}
