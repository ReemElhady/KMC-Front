import { salesInterface } from "src/app/models/products.models";
import * as salesActions from "./sales-action"
export let sales!: salesInterface;


export function SalesReducer(salesState: salesInterface = sales,
    action: salesActions.SalesActionsType): any {
    switch (action.type) {
        case salesActions.STORE_SALE:
            return { ...action.payload }
        case salesActions.UPDATES_SALES:

            return { ...salesState, ...action.payload, results: [...salesState.results, ...action.payload.results] }
        case salesActions.SALES_WISH_LIST:
            if (salesState) {
                let newitems = salesState.results.map(item => {
                    if (item.id == action.payload.id)
                        return { ...item, is_wishlist: action.payload.is_wishlist }
                    else
                        return item
                })
                return { ...salesState, results: [...newitems] }
            }
            else
                return salesState

        default:
            return salesState
    }

}