import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AddressService } from 'src/app/@shared/address.service';
import { CartService } from 'src/app/@shared/cart.service';
import { HttpService, imgUrl } from 'src/app/@shared/http/http.service';
import { AccountAddresses } from 'src/app/models/accounts-addresses.model';
import { CartItem, OrderSammary } from 'src/app/models/cart.model';
import { OrderInterface } from 'src/app/models/order.model';
import { StoreCartItemsAction } from 'src/app/store/cart/cart.actions';
import { SetOrderSummaryAction } from 'src/app/store/cart/order-summaryaction';
import { InertItemToOrderAction } from 'src/app/store/order/order.actions';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  isLoading = false;
  imgUrl = imgUrl;
  allAddresses!: AccountAddresses[];
  allAddressesSub!: Subscription;
  cartItems!: CartItem[];
  cartItemsSub!: Subscription;
  orderSummary!: OrderSammary;
  orderSummarySub!: Subscription;
  orderSub!: Subscription;
  paymentMethod!: any;
  selectedAddress!: AccountAddresses;
  points: any = 0;
  pointValue: any = 0;
  math = Math;
  updated: boolean = false;
  outOFStockErros: any = [];
  generalSub!: Subscription;
  isLoadingSub!: Subscription;
  @ViewChild('openDialog', { static: false }) openBtn!: any;
  @ViewChild('errorDialog', { static: false }) errorDialog!: any;
  constructor(
    private store: Store<{
      accountAddresses: AccountAddresses[];
      cart: CartItem[];
      orderSummay: OrderSammary;
      orders: OrderInterface;
    }>,
    private addressService: AddressService,
    private route: ActivatedRoute,
    private http: HttpService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.isLoadingSub = this.cartService.isLoading.subscribe((value) => {
        this.isLoading = value;
      });
      this.cartService.generalsObject.subscribe((res) => {
        if (res.pointValue) {
          this.pointValue = this.cartService.pointValue;
        }
      });
      try {
        this.points = Number(params.points);
        // this.pointValue = Number(params.pointValue) ;
        let address = Number(params.addresId);
        if (isNaN(this.points) || isNaN(address)) {
          this.router.navigate(['**']);
        }
      } catch (error) {
        this.router.navigate(['**']);
        this.points = 0;
        this.pointValue = 0;
      }
      this.paymentMethod = params.paymentMethod;
      this.allAddressesSub = this.store
        .select('accountAddresses')
        .subscribe((addresses) => {
          this.allAddresses = addresses;
          if (this.allAddresses) {
            let results = this.allAddresses.filter(
              (value: AccountAddresses) => value.id == params.addresId
            );
            if (results.length) this.selectedAddress = results[0];
          }

          if (!addresses) {
            this.isLoading = true;
            this.addressService.getAddresses().subscribe(
              (res) => {
                this.isLoading = false;
              },
              (error) => {
                this.isLoading = false;
              }
            );
          }
        });
      this.cartItemsSub = this.store.select('cart').subscribe((items) => {
        this.cartItems = items;
      });
      this.orderSummarySub = this.store
        .select('orderSummay')
        .subscribe((summary) => {
          this.orderSummary = summary;
        });
    });
  }
  payNow() {
    if (this.paymentMethod && this.selectedAddress) {
      this.isLoading = true;
      this.http
        .postReq('api/order/', {
          address: this.selectedAddress.id,
          payment_method: this.paymentMethod,
          points: this.points,
        })
        .subscribe(
          (res) => {
            this.isLoading = false;
            if (this.paymentMethod == 'Credit Card') {
              if (res.is_points) {
                this.store.dispatch(new StoreCartItemsAction([]));
                this.store.dispatch(new SetOrderSummaryAction(undefined));
                this.orderSub = this.store
                  .select('orders')
                  .subscribe((orders) => {
                    if (!this.updated) {
                      if (orders)
                        this.store.dispatch(
                          new InertItemToOrderAction(res.order)
                        );
                      this.updated = true;
                      this.openBtn.nativeElement.click();
                    }
                  });
              } else {
                window.open(res.iframe_url, '_blank');
                this.router.navigate(['/account', 'orders']);
              }
            } else {
              this.store.dispatch(new StoreCartItemsAction([]));
              this.store.dispatch(new SetOrderSummaryAction(undefined));
              this.orderSub = this.store
                .select('orders')
                .subscribe((orders) => {
                  if (!this.updated) {
                    if (orders)
                      this.store.dispatch(
                        new InertItemToOrderAction(res.order)
                      );
                    this.updated = true;
                    this.openBtn.nativeElement.click();
                  }
                });
            }
          },
          (errors) => {
            this.isLoading = false;
            this.outOFStockErros = [];
            if (errors.error.error && errors.error.message) {
              this.outOFStockErros = errors.error.message;
              this.errorDialog.nativeElement.click();
            }
          }
        );
    }
  }
  ngOnDestroy(): void {
    if (this.allAddressesSub) {
      this.allAddressesSub.unsubscribe();
    }

    if (this.cartItemsSub) {
      this.cartItemsSub.unsubscribe();
    }

    if (this.orderSummarySub) {
      this.orderSummarySub.unsubscribe();
    }
    if (this.orderSub) this.orderSub.unsubscribe();

    if (this.isLoadingSub) this.isLoadingSub.unsubscribe();
  }
}
