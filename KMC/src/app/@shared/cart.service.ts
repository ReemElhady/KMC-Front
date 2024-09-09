import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import {
  BehaviorSubject,
  Subject,
  catchError,
  take,
  tap,
  throwError,
} from 'rxjs';
import { CartItem, OrderSammary } from '../models/cart.model';
import { ProductItemSpec } from '../models/products.models';
import {
  AddToCartAction,
  DeleteCartItemAction,
  StoreCartItemsAction,
} from '../store/cart/cart.actions';
import { SetOrderSummaryAction } from '../store/cart/order-summaryaction';
import { HttpService } from './http/http.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  itemsNumber = new BehaviorSubject<any>(0);
  errors = new Subject<number>();
  orderSummary = new Subject<any>();
  updateErrors = new Subject<any>();
  coupon = new BehaviorSubject<any>(false);
  localCartSub = new BehaviorSubject<any>(false);
  AddedToCartLocal = new BehaviorSubject<any>(false);
  isLoading = new BehaviorSubject<boolean>(false);
  tax: any = 14;
  pointValue: any = 0;
  points: any = 0;
  generalsObject = new BehaviorSubject<any>({
    pointValue: 0,
    tax: 0,
    points: 0,
  });
  constructor(
    private http: HttpService,
    private cs: CookieService,
    private store: Store<{ cart: CartItem[]; orderSummay: OrderSammary }>
  ) {
    this.itemsNumber.next(
      this.getOrCreateCart().items?.reduce(
        (prev: number, curr: { quantity: number }) => prev + curr.quantity,
        0
      ) || 0
    );
    this.orderSummary.next(this.calculateSummary());
  }

  addToCart(
    product: any,
    quntity: number,
    selectedItem: ProductItemSpec | null = null
  ) {
    if (this.cs.get('token')) {
      let url: string = '';

      if (selectedItem) {
        url = `api/cart/add-to-cart/${product.id}/${quntity}/${selectedItem.id}`;
      } else {
        url = `api/cart/add-to-cart/${product.id}/${quntity}`;
      }
      return this.http.getReq(url).pipe(
        take(1),
        tap((res) => {
          this.store.dispatch(new AddToCartAction(res.item));
          this.store.dispatch(new SetOrderSummaryAction(res.order_summary));
        })
      );
    } else {
      let item = [];
      if (selectedItem) {
        item = this.getOrCreateCart().filter(
          (val: any) =>
            val.id == product.id && val.product_item.id == selectedItem.id
        );
      } else {
        item = this.getOrCreateCart().filter(
          (val: any) => val.id == product.id
        );
      }
      let all_quantity = 0;
      if (item.length) all_quantity = item[0].quantity + quntity;
      else all_quantity = quntity;
      let body = {};
      if (selectedItem) {
        body = {
          product_id: product.id,
          quantity: all_quantity,
          product_item: selectedItem.id,
        };
      } else {
        body = { product_id: product.id, quantity: all_quantity };
      }
      return this.http.postReq('api/cart/check-quantity', body).pipe(
        take(1),
        tap((res) => {
          this.SetCartItem(product, quntity, selectedItem);
          this.AddedToCartLocal.next(true);
        })
      );
    }
  }

  getOrCreateCart() {
    let items = localStorage.getItem('cartItems');
    if (!items) {
      localStorage.setItem('cartItems', '[]');
      return [];
    }

    return JSON.parse(items);
  }

  private SetCartItem(
    product: any,
    quantity: number,
    selectedItem: ProductItemSpec | null = null
  ) {
    let selectedItemId = null;
    if (selectedItem) {
      selectedItemId = selectedItem.id;
    }
    let items = this.getOrCreateCart();
    let existsItem!: any;
    for (let i = 0; i < items.length; i++) {
      if (selectedItemId) {
        if (
          items[i].id == product.id &&
          items[i].product_item.id == selectedItemId
        ) {
          items[i].quantity += quantity;
          localStorage.setItem('cartItems', JSON.stringify(items));
          existsItem = items[i];
          break;
        }
      } else {
        if (items[i].id == product.id) {
          items[i].quantity += quantity;
          localStorage.setItem('cartItems', JSON.stringify(items));
          existsItem = items[i];
          break;
        }
      }
    }
    if (!existsItem) {
      let savedProduct = {
        branch: product.branch,
        brand: product.brand,
        created_at: product.created_at,
        id: product.id,
        is_archived: product.is_archived,
        is_wishlist: product.is_wishlist,
        main_image: product['main_image']
          ? product['main_image']
          : product.product_image[0].image,
        point_price: product.point_price,
        price: product.price,
        rate: product.rate,
        sale_price: product.sale_price,
        stock: product.stock,
        sub_branch: product.sub_branch,
        title: product.title,
        type: product.type,
        quantity: quantity,
        product_item: selectedItem,
      };
      items.push(savedProduct);
      localStorage.setItem('cartItems', JSON.stringify(items));

      this.itemsNumber.next(
        items.reduce(
          (prev: number, curr: { quantity: number }) => prev + curr.quantity,
          0
        )
      );
      this.orderSummary.next(this.calculateSummary());
      return product;
    }
    this.itemsNumber.next(
      items.reduce(
        (prev: number, curr: { quantity: number }) => prev + curr.quantity,
        0
      )
    );
    this.orderSummary.next(this.calculateSummary());

    return existsItem;
  }
  private updateOneItem(item: any) {
    let items = this.getOrCreateCart();
    for (let i = 0; i < items.length; i++) {
      let found = false;
      if (item.product_item) {
        found =
          items[i].id == item.id &&
          items[i].product_item.id == item.product_item.id;
      } else {
        found = items[i].id == item.id;
      }
      if (found) {
        items[i] = item;
        break;
      }
    }
    localStorage.setItem('cartItems', JSON.stringify(items));
    this.orderSummary.next(this.calculateSummary());
    this.localCartSub.next(true);
  }
  updateCartItems(items: any) {
    let itemErrors: any = [];
    this.updateErrors.next([]);
    this.isLoading.next(true);
    items.forEach((item: any) => {
      let body = {};
      if (item.product_item) {
        body = {
          product_id: item.id,
          quantity: item.quantity,
          product_item: item.product_item.id,
        };
      } else {
        body = { product_id: item.id, quantity: item.quantity };
      }
      this.http.postReq('api/cart/check-quantity', body).subscribe(
        (res) => {
          this.updateOneItem(item);
          this.isLoading.next(false);
        },
        (error) => {
          if (error.status == 400 && error.error['error'])
            itemErrors.push(item.id);
          this.updateErrors.next(itemErrors);
          this.isLoading.next(false);
        }
      );
    });
    this.itemsNumber.next(
      items.reduce(
        (prev: number, curr: { quantity: number }) => prev + curr.quantity,
        0
      )
    );
    return 0;
  }

  deleteCartItem(productId: string) {
    let items = this.getOrCreateCart().filter(
      (item: any) => item.id != productId
    );
    localStorage.setItem('cartItems', JSON.stringify(items));
    this.itemsNumber.next(
      items.reduce(
        (prev: number, curr: { quantity: number }) => prev + curr.quantity,
        0
      )
    );
    this.orderSummary.next(this.calculateSummary());
  }
  calculateSummary() {
    let items = this.getOrCreateCart();

    let orderSummary: OrderSammary = {
      total_price: 0,
      tax: 14,
      sub_total: 0,
      discount: 0,
      total_points: 0,
    };
    if (!items.length) return orderSummary;
    items.forEach((item: any) => {
      orderSummary.total_points += item.point_price * item.quantity;
      if (item.sale_price)
        orderSummary.total_price += item.sale_price * item.quantity;
      else orderSummary.total_price += item.price * item.quantity;
    });
    orderSummary.tax = Math.round(orderSummary.total_price * (this.tax / 100));
    orderSummary.sub_total = orderSummary.total_price - orderSummary.tax;
    return orderSummary;
  }

  sendGuestItems() {
    let items = this.getOrCreateCart();
    if (this.cs.get('token') && items.length) {
      let mappedItems = items.map((item: any) => {
        let productItemId = null;
        if (item.product_item) {
          productItemId = item.product_item.id;
        }
        return {
          product_id: item.id,
          quantity: item.quantity,
          product_item_id: productItemId,
        };
      });
      return this.http.postReq('api/cart/', mappedItems).pipe(
        tap((res) => {
          this.store.dispatch(new SetOrderSummaryAction(res.order_summary));
          this.store.dispatch(new StoreCartItemsAction(res.cart.cart_items));
          this.itemsNumber.next(0);

          this.coupon.next(res.cart.coupon);
          if (res.error.length) this.errors.next(res.error);
          this.clearCartItmes();
        })
      );
    }
    return null;
  }
  getCartItemsBack() {
    this.isLoading.next(true);
    return this.http.getReq('api/cart/').pipe(
      tap((res) => {
        this.isLoading.next(false);
        this.store.dispatch(new SetOrderSummaryAction(res.order_summary));
        if (res.cart.cart_items) {
          this.store.dispatch(new StoreCartItemsAction(res.cart.cart_items));
        } else {
          this.store.dispatch(new StoreCartItemsAction(res.cart));
        }
        this.coupon.next(res.cart.coupon);
        // this.clearCartItmes();
      }),
      catchError((err) => {
        this.isLoading.next(false);
        return err;
      })
    );
  }
  private clearCartItmes() {
    if (localStorage.getItem('cartItems')) localStorage.removeItem('cartItems');
  }
  updateRemoteItems(items: any) {
    let mappedItems = items.map((value: any) => {
      return {
        item_id: value.id,
        quantity: value.quantity,
      };
    });
    return this.http.patchReq('api/cart/', mappedItems).pipe(
      take(1),
      tap((res) => {
        this.store.dispatch(new SetOrderSummaryAction(res.order_summary));
        this.store.dispatch(new StoreCartItemsAction(res.cart.cart_items));
        this.coupon.next(res.cart.coupon);
      }),
      catchError((errors: any) => {
        this.store.dispatch(
          new StoreCartItemsAction(errors.error.cart.cart_items)
        );
        let errs = errors;
        if (errors.status == 400 && Array.isArray(errors.error.errors)) {
          errs = errors.error.errors.map((error: any) => error.error.item_id);
        }
        return throwError(errs);
      })
    );
  }
  deleteRemoteItem(itemId: number) {
    return this.http.deleteReq(`api/cart/${itemId}`).pipe(
      take(1),
      tap((res) => {
        this.store.dispatch(new SetOrderSummaryAction(res.order_summary));
        this.store.dispatch(new DeleteCartItemAction(itemId));
      })
    );
  }
  applyCoupon(code: any) {
    return this.http.postReq('api/coupon/', code).pipe(
      take(1),
      tap((res) => {
        this.store.dispatch(new SetOrderSummaryAction(res));
        this.coupon.next(code.code);
      })
    );
  }
  deleteCoupon() {
    return this.http.deleteReq('api/coupon/').pipe(
      take(1),
      tap((res) => {
        this.store.dispatch(new SetOrderSummaryAction(res));
        this.coupon.next(null);
      })
    );
  }
  general() {
    return this.http.getReq('api/general').pipe(
      tap((res) => {
        this.tax = res.general.tax_percentage;
        this.points = res.total_points;
        this.pointValue = res.general.point_value;
        this.generalsObject.next({
          tax: this.tax,
          points: this.points,
          pointValue: this.pointValue,
        });
      })
    );
  }
  reorderCart(id: any) {
    return this.http.getReq(`api/order/re-order/${id}`).pipe(
      tap((res) => {
        this.store.dispatch(new SetOrderSummaryAction(res.order_summary));
        if (res.item.cart_items) {
          this.store.dispatch(new StoreCartItemsAction(res.item.cart_items));
        } else {
          this.store.dispatch(new StoreCartItemsAction(res.item));
        }
        this.coupon.next(res.item.coupon);
        // this.clearCartItmes();
      })
    );
  }
}
