import { Faq } from 'src/app/models/faq.model';
import * as FaqActions from './faq.actions';

export let faq!: Faq[];

export function faqReducer(
  faqState: Faq[] = faq,
  action: FaqActions.FaqActions
): any {
  switch (action.type) {
    case FaqActions.FaqAction:
      return [...action.payload];

    default:
      return faqState;
  }
}
