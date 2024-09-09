
export interface ProductItem {
  [key: string | number]: ProductDetails
}
export interface ProductType {
  [key: string | number]: Product
}
export interface Product {
  count: number
  next: string
  previous: string
  results: ProductItem
}
export interface salesInterface {
  count: number
  next: string
  previous: string
  results: ProductDetails[]

}
export interface ProductDetails {

  branch: number
  brand: number
  created_at: string
  description?: string
  id: string
  is_archived: boolean
  is_wishlist: boolean
  name: string //added
  point_price: number
  price: number
  product_image?: ProductImage[]
  main_image?: string
  reviews_list?: ProductReview[]
  product_item?: ProductItemSpec[]
  product_item_title: string;
  product_url?: ProductURL[]
  rate: number
  related_products?: ProductDetails[];
  reviewed?: boolean
  reviews_count?: number
  sale_price: number
  sale_percentage?: number; // Add this line
  stock: number
  sub_branch: number
  title: string
  type: number
}
export interface ProductReview {
  content: string
  id: number
  name: string
  product: string
  rate: number
  user: number
}
export interface ProductItemSpec {
  id: number
  product_item_title: string
  species: string
  stock: number
  product: string

}
export interface ProductImage {
  image: string
}


export interface Review {
  count: number
  next?: number
  previous: number
  results: ProductReview[]
}

export interface ProductURL {
  url: string
}
