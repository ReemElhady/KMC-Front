import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { AddressService } from 'src/app/@shared/address.service';
import { CartService } from 'src/app/@shared/cart.service';
import { imgUrl } from 'src/app/@shared/http/http.service';
import { CartItem, OrderSammary } from 'src/app/models/cart.model';
import { ProductItemSpec } from 'src/app/models/products.models';
declare var UIkit: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  localItems: any = [];
  localOrderSummary!: any;
  imgUrl = imgUrl;
  localOutOfSockErrors: any = [];
  localOrderSummarySub!: Subscription;
  localupdateErrorsSub!: Subscription;
  appiedCoupon: any = null;
  remoteItems: any = [];
  remoteOrderSummary!: any;
  remoteOrderSummarySub!: Subscription;
  remoteItemsSub!: Subscription;
  isLoadingSub!: Subscription;
  appiedCouponSub!: Subscription;
  remoteErrors: any = [];
  couponForm!: FormGroup;
  couponError: boolean = false;
  couponErrorMessage: string = '';
  isClicked: boolean = false;
  constructor(
    private cartService: CartService,
    private cs: CookieService,
    private store: Store<{ cart: CartItem[]; orderSummay: OrderSammary }>,
    private formB: FormBuilder,
    private router: Router
  ) {}
  @ViewChild('openDialog', { static: false }) openBtn!: any;
  ngOnInit(): void {
    this.cartService.localCartSub.subscribe((res) => {
      this.localItems = this.cartService.getOrCreateCart();
    });

    this.couponForm = this.formB.group({
      code: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
    if (!this.cs.get('token')) {
      this.localItems = [...this.cartService.getOrCreateCart()];
      this.cartService.generalsObject.subscribe((res) => {
        if (res.pointValue)
          this.localOrderSummary = this.cartService.calculateSummary();
      });
      this.localupdateErrorsSub = this.cartService.updateErrors.subscribe(
        (errors) => {
          this.localOutOfSockErrors = errors;
          this.localItems = this.cartService.getOrCreateCart();
          // UIkit.notification({
          //   message: this.cs.get('language') == 'ar' ? 'هذه الكمية غير متاحة في المخزن' : 'This Quantity is out of Stock',
          //   status: 'danger',
          //   pos: 'top-center',
          //   timeout: 5000
          // });
        }
      );
      this.localOrderSummarySub = this.cartService.orderSummary.subscribe(
        (order) => {
          if (order) this.localOrderSummary = order;
        }
      );
    } else {
      this.remoteItemsSub = this.store.select('cart').subscribe((items) => {
        if (items) this.remoteItems = items;
        else this.remoteItems = [];
      });
      this.remoteOrderSummarySub = this.store
        .select('orderSummay')
        .subscribe((order) => {
          this.remoteOrderSummary = order;
        });

      this.appiedCouponSub = this.cartService.coupon.subscribe(
        (coupon: any) => {
          this.appiedCoupon = coupon;
        }
      );
    }
    this.isLoadingSub = this.cartService.isLoading.subscribe((value) => {
      this.isLoading = value;
    });
  }
  updateLocalItems() {
    this.cartService.updateCartItems(this.localItems);
  }
  localDeleteItem(productId: string) {
    this.cartService.deleteCartItem(productId);
    this.localItems = this.localItems.filter(
      (item: any) => item.id != productId
    );
  }

  counter(x: number, itemId: string, productItem: ProductItemSpec) {
    if (this.localItems) {
      for (let i = 0; i < this.localItems.length; i++) {
        let found = false;
        if (productItem) {
          found =
            this.localItems[i].id == itemId &&
            this.localItems[i].product_item.id == productItem.id;
        } else {
          found = this.localItems[i].id == itemId;
        }
        if (found) {
          if (x === 1) {
            this.localItems[i].quantity++;
          }
          if (x === -1 && this.localItems[i].quantity > 1) {
            this.localItems[i].quantity--;
          }
          break;
        }
      }
    }
  }
  remoteCounter(x: number, id: number) {
    // this.cartService.addToCart().subscribe((res) => {});
    if (this.remoteItems) {
      this.remoteItems = this.remoteItems.map((item: any) => {
        if (item.id == id) {
          if (x == -1 && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
          if (x == 1) {
            return { ...item, quantity: item.quantity + 1 };
          }
        }
        return item;
      });
    }
    this.updateRemoteItems();
  }
  updateRemoteItems() {
    this.remoteErrors = [];
    this.isLoading = true;
    this.cartService.updateRemoteItems(this.remoteItems).subscribe(
      (res) => {
        this.isLoading = false;
      },
      (errors) => {
        this.remoteErrors = errors;
        // if (errors.status == 400 && Array.isArray(errors.error.errors))
        //   this.remoteErrors = errors.error.errors.map(
        //     (error: any) => error.error.item_id
        //   );
        this.isLoading = false;
      }
    );
  }
  deleteRemoteItem(itemId: number) {
    this.isLoading = true;
    this.cartService.deleteRemoteItem(itemId).subscribe(
      (res) => {
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
      }
    );
  }
  get formContarols() {
    return this.couponForm.controls;
  }
  sendCoupon() {
    if (this.couponForm.valid) {
      this.couponError = false;
      this.isLoading = true;
      this.cartService.applyCoupon(this.couponForm.value).subscribe(
        (res: any) => {
          this.openBtn.nativeElement.click();
          this.couponForm.reset();
          this.isLoading = false;
        },
        (err: HttpErrorResponse) => {
          if (err.error.error) {
            this.couponErrorMessage = err.error.error;
            this.couponError = true;
          }
          this.isLoading = false;
        }
      );
    }
  }
  deleteCoupon() {
    this.isLoading = true;
    this.cartService.deleteCoupon().subscribe(
      (res: any) => {
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }
  navigate() {
    if (!this.cs.get('token')) {
      this.router.navigate(['/auth', 'login']);
    } else {
      this.isClicked = true;

      this.cartService.updateRemoteItems(this.remoteItems).subscribe(
        (res) => {
          this.router.navigate(['/checkout', 'address']);
          this.isClicked = false;
        },
        (errors) => {
          if (errors.status == 400 && Array.isArray(errors.error))
            this.remoteErrors = errors.error.map(
              (error: any) => error.error.item_id
            );
          this.isLoading = false;
          this.isClicked = false;
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.localOrderSummarySub) {
      this.localOrderSummarySub.unsubscribe();
    }
    if (this.localupdateErrorsSub) {
      this.localupdateErrorsSub.unsubscribe();
    }
    if (this.remoteItemsSub) {
      this.remoteItemsSub.unsubscribe();
    }
    if (this.remoteOrderSummarySub) {
      this.remoteOrderSummarySub.unsubscribe();
    }
    if (this.isLoadingSub) {
      this.isLoadingSub.unsubscribe();
    }
    if (this.appiedCouponSub) {
      this.appiedCouponSub.unsubscribe();
    }
  }
}
