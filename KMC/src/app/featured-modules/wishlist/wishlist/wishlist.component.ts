import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/@shared/cart.service';
import { ProductService } from 'src/app/@shared/services/product.service';
import { WishList } from 'src/app/models/wishlist.model';
import { DeleteWishlistAction, GetWishlistAction } from 'src/app/store/wishlist/wishlist-action';
import { imgUrl } from '../../../@shared/http/http.service'
declare var UIkit: any;
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlist!: WishList
  isLoading = false;
  imgUrl = imgUrl;
  private unSub!: Subscription
  paginationIsloading: boolean = false;
  constructor(
    private productService: ProductService,
    private store: Store<{ wishlist: WishList }>,
    private cartService: CartService,
    private cs: CookieService
  ) { }

  ngOnInit(): void {
    this.getAllWishlist();
  }

  getAllWishlist() {
    this.store.select('wishlist').subscribe(wishlist => {
      this.wishlist = wishlist
      if (!this.wishlist||!Object.keys(wishlist).length) {
        this.isLoading = true;
        this.unSub = this.productService.getWishList('api/product/wishlist').subscribe(
          (res: any) => {
            this.store.dispatch(new GetWishlistAction(res));
            
            
            this.isLoading = false;
          }
        )
      }
    })

  }

  delete(typeId: number, id: string) {
    this.productService.deleteWishlist(typeId, id).subscribe(res => {

    })
  }



  sendPagnationRequest() {
    if (this.wishlist) {
      if (this.wishlist.next) {
        this.paginationIsloading = true;
        this.productService.getWishList('api/' + this.wishlist.next.split("/api/")[1]).subscribe(res => {
          this.store.dispatch(new GetWishlistAction(res));
          this.paginationIsloading = false;
        }, error => {
          this.paginationIsloading = false;
        })
      }
    }

  }
  addToCart(product: any) {
    this.cartService.addToCart(product, 1).subscribe((value: any) => {
      UIkit.notification({
        message: this.cs.get('language') == 'ar' ? 'تم اضافة المنتج الي السلة' : 'added to cart successfully',
        status: 'success',
        pos: 'top-center',
        timeout: 5000
      });

    }, (error) => {
      if (error.status == 400 && error.error["error"]) {
        UIkit.notification({
          message: this.cs.get('language') == 'ar' ? 'الكمية اكثر من المتاح في المخزن' : 'item is out of stock',
          status: 'danger',
          pos: 'top-center',
          timeout: 5000
        });
      }
    })
  }
  ngOnDestroy(): void {
    if (this.unSub) {
      this.unSub.unsubscribe()
    }
  }
}
