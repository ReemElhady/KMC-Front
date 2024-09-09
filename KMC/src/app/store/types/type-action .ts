import { Action } from '@ngrx/store';
import { AppType } from 'src/app/models/type.model';

export const STORE_TYPE = 'STORE_TYPE';

export class StoreTypeActions implements Action {
  readonly type = STORE_TYPE;
  constructor(public payload: AppType[]) {}
}
