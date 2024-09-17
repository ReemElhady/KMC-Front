  import { HttpClient, HttpResponse } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { WishList } from 'src/app/models/wishlist.model';
  import { map, Observable, tap } from 'rxjs'
  import { Product, ProductDetails, ProductReview, salesInterface } from 'src/app/models/products.models';
  import { Filters } from 'src/app/models/product-filter.model';
  import { Store } from '@ngrx/store'
  import { AddWishlistAction, DeleteWishlistAction } from 'src/app/store/wishlist/wishlist-action';
  import { UpdateProductActions } from 'src/app/store/product/product-action';
  import { environment } from 'src/environments/environment';
  import { WishListSalesActions } from 'src/app/store/sales/sales-action';


  @Injectable({
    providedIn: 'root'
  })
  export class ProductService {
    private BaseUrl = environment.baseUrl;


    constructor(
      private http: HttpClient,
      private store: Store<{ productDetails: ProductDetails[], productReviews: ProductReview[], sales: salesInterface }>,

    ) { }

    // whishList Methods

    getWishList(url: string): Observable<WishList> {
      return this.http.get<WishList>(this.BaseUrl + url);
    }
    deleteWishlist(typeId: number, prodId: string) {
      return this.http.delete(this.BaseUrl + 'api/product/wishlist/' + prodId).pipe(tap(res => {

        this.store.dispatch(new DeleteWishlistAction(prodId))
        this.store.dispatch(new UpdateProductActions({ typeId, prodId, is_wishlist: false }))
        this.store.dispatch(new WishListSalesActions({ id: prodId, is_wishlist: false }))

      }))
    }
    addToWishlist(typeId: number, prodId: string) {

      return this.http.post(this.BaseUrl + 'api/product/wishlist', { 'pk': prodId }).pipe(tap((res: any) => {
        this.store.dispatch(new AddWishlistAction(res))
        this.store.dispatch(new UpdateProductActions({ typeId, prodId, is_wishlist: true }))
        this.store.dispatch(new WishListSalesActions({ id: prodId, is_wishlist: true }))
      }))
    }
    getProduct(url: string): Observable<any> {
      return this.http.get<Product>(`${this.BaseUrl}${url}`).pipe(map((res: any) => {

        let returnedData = {
          next: res.next,
          count: res.count,
          previous: res.previous,
          results: {},
        }
        let results: any = {};
        res.results.forEach((product: ProductDetails) => {
          results[product.id] = product
        });
        returnedData['results'] = results
        return returnedData

      }))
    }
    filterList(url: string): Observable<Filters> {
      return this.http.get<Filters>(this.BaseUrl + url)

    }



  }
