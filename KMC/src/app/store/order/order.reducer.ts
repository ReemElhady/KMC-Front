import { OrderInterface } from "src/app/models/order.model";
import * as orderActions from "./order.actions"
export let orders!: OrderInterface;


export function orderReducer(orderState: OrderInterface = orders,
  action: orderActions.orderTypesActions): any {
  switch (action.type) {
    case orderActions.STORE_ORDERS:
      return { ...action.payload }
    case orderActions.ADD_NEW_ITEMS_TO_ORDERS:

      return { ...orderState, ...action.payload, results: [...action.payload.results, ...orderState.results] }

    case orderActions.UPDATE_ITEMS_TO_ORDERS:
      if (orderState) {
        let newOrders: OrderInterface = { ...orderState }
        newOrders.results = newOrders.results.map((order: any) => {
          if (order.id == action.payload.id)
            return action.payload
          return order

        })
        return newOrders
      }
      else
        return orderState

    case orderActions.INSERT_ITEM_TO_ORDERS:
      if (orderState) {
        let newOrders: OrderInterface = { ...orderState };
        let ex = false;
        newOrders.results = newOrders.results.map((order: any) => {
          if (order.id == action.payload.id) {
            ex = true;
          }
          return order

        })
        if (!ex) {
          return { ...orderState, results: [action.payload, ...orderState.results] }
        }
        else {
          return newOrders;
        }
      }
      return orderState
    default:
      return orderState
  }

}
