import { Action } from "@ngrx/store";
import { salesInterface } from "src/app/models/products.models";

export const STORE_SALE = 'STORE_SALE'
export const UPDATES_SALES = 'UPDATES_SALES'
export const SALES_WISH_LIST = 'SALES_WISH_LIST'



export class StoreSalesAction implements Action {
  readonly type = STORE_SALE
  constructor(public payload: salesInterface) { }
}

export class UpdateSalesActions implements Action {
  readonly type = UPDATES_SALES
  constructor(public payload: salesInterface) { }
}

export class WishListSalesActions implements Action {
  readonly type = SALES_WISH_LIST
  constructor(public payload: { id: any, is_wishlist: any }) { }
}

export type SalesActionsType = StoreSalesAction | UpdateSalesActions | WishListSalesActions;