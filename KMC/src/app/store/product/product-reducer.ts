import { ProductDetails, ProductType, Product } from '../../models/products.models';
import * as product from "./product-action";

export let allProducts!: ProductType;

export function productReducer(productState: ProductType = allProducts,
  action: product.ProductActionTypes
): any {
  switch (action.type) {
    case product.PRODUCT:
      if (!productState)
        return { ...action.payload }
      else {
        const currentKey = Object.keys(action.payload)[0]
        if (productState[currentKey]) {
          let currentState: ProductType = {
            ...productState, [currentKey]: {
              ...productState[currentKey], ...action.payload[currentKey]
              , results: { ...productState[currentKey].results, ...action.payload[currentKey].results }
            }
          }
          return { ...currentState }
        }
        return { ...productState, ...action.payload }
      }
    case product.PRODUCT_FILTER:
      const currentKey = Object.keys(action.payload)[0]
      let currentState: ProductType = {
        ...productState, [currentKey]: {
          ...productState[currentKey], ...action.payload[currentKey]
        }
      }
      return currentState
    case product.SINGLE_PRODUCT:
      let newState: ProductType = { ...productState, [action.payload.type]: { ...productState[action.payload.type], results: { ...productState[action.payload.type].results, [action.payload.id]: { ...productState[action.payload.type].results[action.payload.id], ...action.payload } } } }
      return newState
    case product.UPDATE_PRODUCT:
      if (productState) {
        if (productState[action.payload.typeId]) {
          if (productState[action.payload.typeId].results[action.payload.prodId]) {
            let typeId = action.payload.typeId
            let prodId = action.payload.prodId
            let newProd = { ...productState[typeId].results[prodId] }
            newProd.is_wishlist = action.payload.is_wishlist
            let currentProdState = { ...productState, [typeId]: { ...productState[typeId], results: { ...productState[typeId].results, [prodId]: { ...newProd } } } }
            return currentProdState
          }
        } else
          return productState
      }
      return productState
    default:
      return productState
  }
}
