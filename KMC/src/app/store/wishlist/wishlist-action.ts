import { Action } from '@ngrx/store'
import { WishList, WishListBody, WishListItem } from 'src/app/models/wishlist.model'

export const GETWISHLIST = 'GETWISHLIST'
export const ADDWISHLIST = 'ADDWISHLIST'
export const DELETEWISHLIST = 'DELETEWISHLIST'

export class GetWishlistAction implements Action {
  readonly type = GETWISHLIST
  constructor(public payload: WishList|any) {}
}
export class AddWishlistAction implements Action {
  readonly type = ADDWISHLIST
  constructor(public payload: WishListBody) {}
}
export class DeleteWishlistAction implements Action {
  readonly type = DELETEWISHLIST
  constructor(public payload: string) {}
}

export type wishlistActions = GetWishlistAction | AddWishlistAction | DeleteWishlistAction

// export const getWishlist = 'Get Wishlist';
// export const postWishlist = 'Get Wishlist';
// export const deleteWishlist = 'Get Wishlist';

// export class GetWishlistAction implements Action {
//   readonly type = getWishlist;
//   constructor() {}
// }

// export class PostWishlistAction implements Action {
//   readonly type = postWishlist;
//   constructor(public payload: string) {}
// }

// export class DeleteWishlistAction implements Action {
//   readonly type = deleteWishlist;
//   constructor(public payload: string) {}
// }

// export  type wishlistTypesActions= GetWishlistAction | PostWishlistAction | DeleteWishlistAction
