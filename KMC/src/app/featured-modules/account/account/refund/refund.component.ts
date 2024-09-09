import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { HttpService, imgUrl } from 'src/app/@shared/http/http.service';
import { OrderService } from 'src/app/@shared/order.service';
import { OrderInterface } from 'src/app/models/order.model';
import { UpdateItemsToOrderAction } from 'src/app/store/order/order.actions';
declare let UIkit: any;
@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss']
})
export class RefundComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  order!: any;
  orderSub!: Subscription;
  imgUrl = imgUrl;
  checkOptions: any = [];
  checkAll: any = false;
  isSuccess: boolean = false;
  constructor(
    private store: Store<{ orders: OrderInterface }>,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    public cs: CookieService,
    private http: HttpService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.orderSub = this.store.select("orders").subscribe(orders => {
        if (orders) {
          let order = orders.results.filter((order: any) => order.id == params.id)

          if (!order.length) {
            this.requestOrder(params.id)
          } else {

            this.order = { ...order[0] }
            console.log(this.order.items);

            this.order.items = this.order.items.filter((item: any) => item.status != 'Refunded' && item.status != 'Refund Requested')
            this.checkOptions = []
            this.order.items.forEach((item: any) => {
              this.checkOptions.push({ check: false, quantity: item.quantity, comment: "", isError: false })
            });
          }
        }
        else if (!orders) {
          this.requestOrder(params.id)
        }
      })
    })
  }
  requestOrder(id: any) {
    this.isLoading = true;
    this.orderService.getOrder(id).subscribe(res => {
      try {
        this.order = res.results[0]
        this.order.items = this.order.items.filter((item: any) => item.status != 'Refunded' && item.status != 'Refund Requested')
        this.checkOptions = []
        this.order.items.forEach((item: any) => {
          this.checkOptions.push({ check: false, quantity: item.quantity, comment: "", isError: false })
        });

      }
      catch (error) { this.router.navigate(['**']) }
      this.isLoading = false;
    }, error => { this.isLoading = false })

  }
  ngOnDestroy(): void {
    if (this.orderSub)
      this.orderSub.unsubscribe()

  }
  counter(x: number, itemId: any) {
    let item = this.checkOptions[itemId]
    let orderItem = this.order.items[itemId]
    if (x == 1) {
      if (item.quantity < orderItem.quantity) {
        item.quantity++;
      }

    }
    else if (x == -1 && item.quantity > 1) {
      item.quantity--;
    }

  }
  handleChackAll() {
    this.checkOptions.forEach((el: any) => {
      el.check = this.checkAll
    })
  }
  refund() {
    let data: any = []
    let validForm = true;
    this.checkOptions.forEach((item: any, index: any) => {
      if (item.check) {
        if (!item.comment.length) {
          validForm = false;
          item.isError = true;
        }
        data.push({
          id: this.order.items[index].id,
          quantity: item.quantity,
          reason: item.comment ? item.comment : ''
        })
      }
    })
    if (data.length && validForm) {
      this.isLoading = true
      this.http.postReq("api/order/refund/", { refunded_items: data, reason: null, id: this.order.id }).subscribe(res => {
        this.store.dispatch(new UpdateItemsToOrderAction(res.order))
        // this.router.navigate(['/account', 'orders'])
        this.isLoading = false;
        this.isSuccess = true;
        UIkit.modal("#refund_response").show();

      }, error => {
        this.isLoading = false;
        this.isSuccess = false;;
        UIkit.modal("#refund_response").show();


      })
    }
  }
  removeError(index: number) {
    this.checkOptions[index].isError = this.checkOptions[index].comment.length == 0;
  }

}

