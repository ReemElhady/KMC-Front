import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HttpService, imgUrl } from 'src/app/@shared/http/http.service';
import { Brands } from 'src/app/models/product-filter.model';
import { AppType } from 'src/app/models/type.model';
import { StoreTypeActions } from 'src/app/store/types/type-action ';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit, OnDestroy {
  imgUrl = imgUrl;
  isLoading: boolean = false;
  private typeSubscription!: Subscription;
  types: AppType[] = [];
  brands!: Brands[];
  constructor(
    private store: Store<{ types: AppType[] }>,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.httpService.getReq('api/courses/brand').subscribe((res: any) => {
      this.brands = res;
    });
    this.typeSubscription = this.store.select('types').subscribe(
      (types) => {
        this.types = types;
        if (!types) {
          this.isLoading = true;
          this.httpService.getReq('api/product/types').subscribe((res) => {
            this.store.dispatch(new StoreTypeActions(res));
            this.isLoading = false;
          });
        }
      },
      (error) => {}
    );
  }
  ngOnDestroy(): void {
    if (this.typeSubscription) {
      this.typeSubscription.unsubscribe();
    }
  }
}
