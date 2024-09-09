import { Action } from '@ngrx/store';
import { OrderSammary } from 'src/app/models/cart.model';


export const SET_ORDER_SUMMARY = 'SET_ORDER_SUMMARY';

export class SetOrderSummaryAction implements Action {
  readonly type = SET_ORDER_SUMMARY;
  constructor(public payload: OrderSammary|any) {}
}

export type OrderSummaryActionsTypes = SetOrderSummaryAction;