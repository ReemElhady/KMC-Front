import { AppType } from 'src/app/models/type.model';
import * as typeActions from './type-action ';

export let appType!: AppType[];

export function typeReducer(
  apptype: AppType[] = appType,
  action: typeActions.StoreTypeActions
): any {
  switch (action.type) {
    case typeActions.STORE_TYPE:
      return [...action.payload];
    default:
      return apptype;
  }
}
