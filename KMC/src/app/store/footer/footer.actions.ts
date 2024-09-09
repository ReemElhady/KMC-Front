import { Action } from '@ngrx/store';
import { Footer } from 'src/app/models/footer.model';

export const Footer_Action = 'Footer_Action';

export class FooterAboutActions implements Action {
  readonly type = Footer_Action;
  constructor(public payload: Footer) {}
}
