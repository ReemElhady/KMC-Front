import { Action } from '@ngrx/store';
import { ProductReview } from 'src/app/models/products.models';

export const PRODUCT_ADD_REVIEW = "PRODUCT_ADD_REVIEW"
export const PRODUCT_DELETE_REVIEW = "PRODUCT_DELETE_REVIEW"
export const PRODUCT_GET_REVIEW = "PRODUCT_GET_REVIEW"

export class ProductReviewAddActions implements Action {
  readonly type = PRODUCT_ADD_REVIEW;
  constructor(public payload: ProductReview) { }
}

export class ProductReviewDeleteActions implements Action {
  readonly type = PRODUCT_DELETE_REVIEW;
  constructor(public payload: number) { }
}

export class ProductReviewGetActions implements Action {
  readonly type = PRODUCT_GET_REVIEW;
  constructor(public payload: ProductReview[]) { }
}
export  type reviewActionTypes= ProductReviewDeleteActions | ProductReviewGetActions |ProductReviewAddActions