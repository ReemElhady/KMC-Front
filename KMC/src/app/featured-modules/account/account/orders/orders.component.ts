import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { inject } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Subscription, catchError, throwError } from 'rxjs';
import { CartService } from 'src/app/@shared/cart.service';
import { imgUrl } from 'src/app/@shared/http/http.service';
import { OrderService } from 'src/app/@shared/order.service';
import { CartItem, OrderSammary } from 'src/app/models/cart.model';
import { OrderInterface } from 'src/app/models/order.model';
import { StoreCartItemsAction } from 'src/app/store/cart/cart.actions';
import { SetOrderSummaryAction } from 'src/app/store/cart/order-summaryaction';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  allOrders!: any;
  allOrdersSub!: Subscription;
  isLoading: boolean = false;
  paginationIsloading: boolean = false;
  imgUrl = imgUrl;

  isSuccess!: any;
  @ViewChild('openDialog', { static: false }) openBtn!: any;
  constructor(
    private orderService: OrderService,
    private store: Store<{
      orders: OrderInterface;
      cart: CartItem[];
      orderSummay: OrderSammary;
    }>,
    private route: ActivatedRoute,
    public cs: CookieService,
    private cartService: CartService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((pararms: any) => {
      if (pararms.is_success) {
        this.isSuccess = pararms.is_success;
        this.openBtn.nativeElement.click();
        if (this.isSuccess == 'true') {
          this.store.dispatch(new StoreCartItemsAction([]));
          this.store.dispatch(new SetOrderSummaryAction(undefined));
        }
      }
    });
    this.allOrdersSub = this.store.select('orders').subscribe((orders) => {
      if (!orders) {
        this.isLoading = true;
        this.orderService.getAllOrders().subscribe(
          (res: any) => {
            this.allOrders = res;

            this.isLoading = false;
            if (this.isSuccess == 'true' || this.isSuccess == 'false')
              this.openBtn.nativeElement.click();
          },
          (erorrs) => {
            this.isLoading = false;
            if (this.isSuccess == 'true' || this.isSuccess == 'false')
              this.openBtn.nativeElement.click();
          }
        );
      }
    });
  }
  sendPagnationRequest() {
    if (this.allOrders && this.allOrders.next) {
      this.paginationIsloading = true;
      this.orderService.addItemsToOrders(this.allOrders.next).subscribe(
        (res: any) => {
          // Append new results to the existing orders
          this.allOrders.results = [...this.allOrders.results, ...res.results];
  
          // Update the next URL for pagination
          this.allOrders.next = res.next;
          
          this.paginationIsloading = false;
        },
        (error) => {
          this.paginationIsloading = false;
        }
      );
    }
  }
  
  reorder(id: any) {
    this.isLoading = true;
    this.cartService.reorderCart(id).subscribe(
      (res) => {
        this.router.navigate(['/cart']);
        this.isLoading = false;
      },
      (erorr) => {
        this.isLoading = false;
      }
    );
  }
  payNow(id: number) {
    this.http
      .post(environment.baseUrl + `api/order/pay-order/${id}/`, {})
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            window.location.reload();
          }
          return throwError('Something bad happened; please try again later.');
        })
      )
      .subscribe((res: any) => {
        window.open(res, '_blank');
      });
  }
  ngOnDestroy(): void {
    if (this.allOrdersSub) this.allOrdersSub.unsubscribe();
  }
}
