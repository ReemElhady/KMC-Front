import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpService } from 'src/app/@shared/http/http.service';
import { ProductDetails, ProductType, salesInterface } from 'src/app/models/products.models';
import { StoreSalesAction, UpdateSalesActions } from 'src/app/store/sales/sales-action';
import { imgUrl } from '../../../../@shared/http/http.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  products: ProductDetails[] = [];
  isLoading = false;
  PaginateisLoading: boolean = false;
  next: any = null;
  productsList!: ProductType;
  data: any;
  imgUrl = imgUrl;

  constructor(
    private store: Store<{ sales: salesInterface }>,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.store.select('sales').subscribe((sales) => {
      if (sales) {
        this.products = sales.results || [];
        this.next = sales.next || null;
      } else {
        this.isLoading = true;
        this.http.getReq('api/product?sale=0').subscribe(
          (res: any) => {
            this.store.dispatch(new StoreSalesAction(res));
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
          }
        );
      }
    });

    this.http.getReq('api/offers').subscribe((res) => {
      this.data = res;
    });
  }
  

  loadMoreItems() {
    if (this.next) {
      this.PaginateisLoading = true;
      this.http.getReq('api/' + this.next.split('/api/')[1]).subscribe(
        (res: any) => {
          this.store.dispatch(new UpdateSalesActions(res));
          this.PaginateisLoading = false;
          this.next = res.next; // Update the next URL for further requests
        },
        (errors) => {
          this.PaginateisLoading = false;
        }
      );
    }
  }
}