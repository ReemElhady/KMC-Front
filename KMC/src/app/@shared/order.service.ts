import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, tap } from 'rxjs';
import { OrderInterface } from '../models/order.model';
import { PointsAction } from '../store/accounts/points/points-action';
import {
  AddNewItemsToOrderAction,
  StoreOrdersAction,
} from '../store/order/order.actions';
import { HttpService } from './http/http.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private http: HttpService,
    private store: Store<{ orders: OrderInterface }>
  ) {}

  getAllOrders() {
    return this.http.getReq('api/order/').pipe(
      take(1),
      tap((res) => {
        // this.store.dispatch(new StoreOrdersAction(res));
      })
    );
  }
  addItemsToOrders(next: any) {
    return this.http.getReq('api/' + next.split('/api/')[1]).pipe(
      tap((res) => {
        this.store.dispatch(new AddNewItemsToOrderAction(res));
      })
    );
  }
  getOrder(id: any) {
    return this.http.getReq(`api/order/${id}`);
  }
  getPoints() {
    return this.http.getReq('api/points/').pipe(
      tap((res) => {
        this.store.dispatch(new PointsAction(res));
      })
    );
    {
    }
  }
}
