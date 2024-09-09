import { Action } from '@ngrx/store';
import { CartItem } from 'src/app/models/cart.model';

export const STORE_CART_ITEMS ="STORE_CART_ITEMS";
export const ADD_TO_CART = 'ADD_TO_CART';
export const DELETE_CART_ITEM = 'DELETE_CART_ITEM';

export class StoreCartItemsAction implements Action {
  readonly type = STORE_CART_ITEMS;
  constructor(public payload: CartItem[]|any) {}
}

export class AddToCartAction implements Action {
  readonly type = ADD_TO_CART;
  constructor(public payload: CartItem) {}
}
export class DeleteCartItemAction implements Action {
  readonly type = DELETE_CART_ITEM;
  constructor(public payload: number) {}
}

export type CartActionsTypes = AddToCartAction|StoreCartItemsAction | DeleteCartItemAction;