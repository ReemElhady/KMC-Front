export interface WishList {
  count: number;
  next: string;
  previous: null;
  results: WishListBody[];
}

export interface WishListBody {
  id: number;
  product: string;
  product_details: WishListItem;
  user: number;
}

export interface WishListItem {
  title: string;
  main_image: string;
  id: string;
  type: number;
  price: number;
  sale_price: number
}
