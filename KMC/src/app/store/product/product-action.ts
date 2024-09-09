import { Action } from '@ngrx/store';
import { ProductDetails, ProductType } from 'src/app/models/products.models';

export const PRODUCT = "PRODUCT"
export const UPDATE_PRODUCT = "UPDATE_PRODUCT"
export const PRODUCT_FILTER = "PRODUCT_FILTER"
export const SINGLE_PRODUCT = "SINGLE_PRODUCT"

export class ProductActions implements Action {
  readonly type = PRODUCT;
  constructor(public payload: ProductType) { }
}

export class SingleProductActions implements Action {
  readonly type = SINGLE_PRODUCT;
  constructor(public payload: ProductDetails) { }
}

export class UpdateProductActions implements Action {
  readonly type = UPDATE_PRODUCT;
  constructor(public payload: {typeId:number,prodId:string,is_wishlist:boolean}) { }
}
export class FilterProductActions implements Action {
  readonly type = PRODUCT_FILTER;
  constructor(public payload: any) { }
}
export type ProductActionTypes = UpdateProductActions|ProductActions |FilterProductActions |SingleProductActions ;