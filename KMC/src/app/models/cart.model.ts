import { ProductItemSpec } from "./products.models";

interface Product {
    id:string ;
    title: string;
    main_image:string ;
    price:number;
    sale_price:number;

}
export interface CartItem{
    id:number ;
    product:Product;
    quantity:number;
    out_of_stock:any ;
    product_item:ProductItemSpec
}
export interface OrderSammary{
    total_price:number ; 
    tax:number ; 
    sub_total:number ; 
    discount:number ;
    shipping?:number
    total_points:number

}

