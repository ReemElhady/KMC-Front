import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CartService } from 'src/app/@shared/cart.service';
import { HttpService } from 'src/app/@shared/http/http.service';
import { OrderService } from 'src/app/@shared/order.service';
import { Points } from 'src/app/models/points.model';
import { PointsAction } from 'src/app/store/accounts/points/points-action';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss']
})
export class PointsComponent implements OnInit {
  isLoading: boolean = false
  pointsContent!: Points;
  unSubscribe: any;
  pointValue: number = 0;
  constructor(private http: HttpService,
    private store: Store<{ points: Points }>,
    private orderServices: OrderService,
    private cartService: CartService,

  ) { }

  ngOnInit(): void {
    this.getAllData()
    this.cartService.generalsObject.subscribe(res => {
      if (res.pointValue) {
        this.pointValue = res.pointValue;
      }
    })
  }
  //get points
  getAllData() {
    this.isLoading = false
    this.store.select('points').subscribe((points) => {
      this.pointsContent = points
      if (!this.pointsContent) {
        this.isLoading = true
        this.unSubscribe = this.orderServices
          .getPoints().subscribe(res => {

            this.isLoading = false;
          }, errors => {
            this.isLoading = false;
          })
      }
    })
  }
}
