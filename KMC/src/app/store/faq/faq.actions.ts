import { Action } from '@ngrx/store';
import { Faq } from 'src/app/models/faq.model';

export const FaqAction = 'FaqAction';

export class FaqActions implements Action {
  readonly type = FaqAction;
  constructor(public payload: Faq[]) {}
}
