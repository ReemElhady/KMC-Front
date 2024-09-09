import { WishList } from '../../models/wishlist.model'
import * as wishlistActions from './wishlist-action'

export let allWishLists!: WishList | any

export function wishlistReducer(
  wishListState: WishList | any = allWishLists,
  action: wishlistActions.wishlistActions,
): any {
  switch (action.type) {
    case wishlistActions.GETWISHLIST:
      if (action.payload) {
        if (wishListState) {
          let newList = { ...action.payload }
          newList.results = newList.results.concat(wishListState.results)
          return newList
        }
        else {
          return { ...action.payload }

        }
      }
      else {
        return undefined
      }

    case wishlistActions.ADDWISHLIST:
      if (wishListState) {
        let addWishlist = { ...wishListState }
        if (addWishlist.results) {
          let insertWishlist = [...addWishlist.results]
          insertWishlist.push(action.payload)
          addWishlist.results = insertWishlist
        }
        return addWishlist
      }
      else
        return wishListState
    case wishlistActions.DELETEWISHLIST:
      if (wishListState) {
        let deleteWishlist = { ...wishListState }
        if (deleteWishlist.results) {
          let deleteWishlistRes = [...deleteWishlist.results]
          const index = deleteWishlistRes.findIndex(
            (arr) => arr.product == action.payload,
          )
          deleteWishlistRes.splice(index, 1)
          deleteWishlist.results = deleteWishlistRes
        }
        return deleteWishlist
      }
      else
        return wishListState

    default:
      return wishListState
  }
}
