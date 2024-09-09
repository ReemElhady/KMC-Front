import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppType } from 'src/app/models/type.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  shopList: AppType[] = [];
  isLoading: boolean = false;
  constructor(private store: Store<{ types: AppType }>) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.store.select('types').subscribe(
      (res: any) => {
        if (res) {
          this.shopList = res;
          this.isLoading = false;
        }
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }
}
