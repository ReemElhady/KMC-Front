import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/@shared/http/http.service';
import { CoursesList } from 'src/app/models/course-list.model';
import { Brands } from 'src/app/models/product-filter.model';
import { StoreListActions } from 'src/app/store/course-list/course-list-action';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CoursesListComponent implements OnInit, OnDestroy {
  // typeId!: string;
  // branchId!: any;
  brandId!: any;
  list!: any;
  listToDisplay: any = [];
  brands!: Brands[];

  listSubscription!: Subscription;
  isRequested: boolean = false;

  isLoading = false;
  private unSubscribe!: Subscription;

  constructor(
    private router: ActivatedRoute,
    private store: Store<{ courseList: CoursesList[] }>,
    private httpService: HttpService,
    
  ) {}

  ngOnInit(): void {
    // this.router.params.subscribe((params) => {
    //   // this.typeId = params['typeId'];
    //   // this.branchId = params['branchId'];
    //   this.brandId = params['typeId'];
    // });
    this.httpService.getReq('api/courses').subscribe((res: any) => {
      this.brands = res;
    });
    this.listSubscription = this.store
      .select('courseList')
      .subscribe((courseList) => {
        if (!this.listToDisplay.length && !this.isRequested) {
          this.isRequested = true;
          this.list = courseList;
          this.listToDisplay = this.getListData();

          if (!this.isCourseExists()) {
            this.sendListRequest();
          }
        }
      });
  }

  sendListRequest() {
    this.isLoading = true;
    this.httpService.getReq('api/courses').subscribe((res: any) => {
      {
        if (res.length) {
          this.store.dispatch(new StoreListActions(res));
          this.listToDisplay = res;
          this.isLoading = false;
        } else {
          this.listToDisplay = [];
          this.isLoading = false;
        }
      }
    });
    //   this.httpService.getReq(`api/courses/${this.brandId}`).subscribe(
    //     (res) => {
    //       if (res.length) {
    //         this.store.dispatch(new StoreListActions(res));
    //         this.listToDisplay = res;
    //         this.isLoading = false;
    //       } else {
    //         this.listToDisplay = [];
    //         this.isLoading = false;
    //       }
    //     },
    //     (error) => {
    //       this.isLoading = false;
    //     }
    //   );
  }
  ngOnDestroy(): void {
    if (this.unSubscribe) {
      this.unSubscribe.unsubscribe();
    }
  }
  isCourseExists(): any {
    if (!this.list) return false;
    else {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].brand == this.brandId) {
          return true;
        }
      }
      return false;
    }
  }
  getListData() {
    if (this.list) {
      let lists = this.list.filter(
        (val: CoursesList) => val.brand == parseInt(this.brandId)
      );

      return lists;
    }
    return [];
  }
}
