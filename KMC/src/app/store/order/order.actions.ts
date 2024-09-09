import { Action } from "@ngrx/store";
import { OrderInterface, OrderResults } from "src/app/models/order.model";


export const STORE_ORDERS = 'STORE_ORDERS'
export const ADD_NEW_ITEMS_TO_ORDERS = 'ADD_NEW_ITEMS_TO_ORDERS'
export const UPDATE_ITEMS_TO_ORDERS = 'UPDATE_ITEMS_TO_ORDERS'
export const INSERT_ITEM_TO_ORDERS = 'INSERT_ITEM_TO_ORDERS'


export class StoreOrdersAction implements Action {
  readonly type = STORE_ORDERS
  constructor(public payload: OrderInterface) { }
}

export class AddNewItemsToOrderAction implements Action {
  readonly type = ADD_NEW_ITEMS_TO_ORDERS
  constructor(public payload: OrderInterface) { }
}
export class UpdateItemsToOrderAction implements Action {
  readonly type = UPDATE_ITEMS_TO_ORDERS
  constructor(public payload: any) { }
}
export class InertItemToOrderAction implements Action {
  readonly type = INSERT_ITEM_TO_ORDERS
  constructor(public payload: OrderResults) { }
}


export type orderTypesActions = StoreOrdersAction | AddNewItemsToOrderAction | UpdateItemsToOrderAction | InertItemToOrderAction