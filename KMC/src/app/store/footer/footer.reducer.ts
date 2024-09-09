import { Footer } from '../../models/footer.model';
import * as footerActions from './footer.actions';

export let footer!: Footer;

export function footerReducer(
  footernState: Footer = footer,
  action: footerActions.FooterAboutActions
): any {
  switch (action.type) {
    case footerActions.Footer_Action:
      return {
        ...action.payload,
      };

    default:
      return footernState;
  }
}
