import { ProductReview } from '../../models/products.models'
import * as reviewActions from './reviews-action'
export let allProductReviews!: ProductReview[]

export function productReviewReducer(
  productReviewsState: ProductReview[] = allProductReviews,
  action: reviewActions.reviewActionTypes,
): any {
  switch (action.type) {
    case reviewActions.PRODUCT_GET_REVIEW:
      if (!productReviewsState) return [...action.payload]
      else {

        return [...productReviewsState, ...action.payload]
      }
    case reviewActions.PRODUCT_ADD_REVIEW:
      if (!productReviewsState) return [{ ...action.payload }]
      else return [...productReviewsState, { ...action.payload }]
    case reviewActions.PRODUCT_DELETE_REVIEW:
      let oldState = [...productReviewsState]
      const index = oldState.findIndex(arr => arr.user == action.payload)
      oldState.splice(index, 1)
      return oldState
    // if (!productReviewsState) return [{...action.payload }]
    // else return [...productReviewsState, { ...action.payload }]
    default:
      return productReviewsState
  }
}
