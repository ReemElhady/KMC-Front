import { CartItem, OrderSammary } from 'src/app/models/cart.model';
import * as CartActions from './cart.actions';
import * as orderSummaryActions from './order-summaryaction';

export let cart!: CartItem[] | any;
export let orderSummary!: OrderSammary;

export function cartReducer(
  cartItemsState: CartItem[] = cart,
  action: CartActions.CartActionsTypes
): any {
  switch (action.type) {
    case CartActions.STORE_CART_ITEMS:
      return [...action.payload];

    case CartActions.ADD_TO_CART:
      if (!cartItemsState || !cartItemsState.length)
        return [{ ...action.payload }];
      else {
        let existsItem = cartItemsState.filter(
          (val: any) => val.id == action.payload.id
        );
        if (existsItem.length) {
          let items = cartItemsState.map((value) => {
            if (value.id == action.payload.id)
              return { ...value, ...action.payload };
            else return value;
          });
          return items;
        } else {
          return [...cartItemsState, { ...action.payload }];
        }
      }
    case CartActions.DELETE_CART_ITEM:
      let newItems = [...cartItemsState];
      return cartItemsState.filter((item) => item.id != action.payload);
    default:
      return cartItemsState;
  }
}

export function orderSummaryReducer(
  orderSummaryState: OrderSammary = orderSummary,
  action: orderSummaryActions.OrderSummaryActionsTypes
): any {
  switch (action.type) {
    case orderSummaryActions.SET_ORDER_SUMMARY:
      if (!orderSummaryState) {
        console.log(orderSummaryState);
        return { ...action.payload };
      } else {
        console.log(orderSummaryState);
        console.log('reducer', action.payload);
        return { ...orderSummaryState, ...action.payload };
      }
    default:
      return orderSummaryState;
  }
}
