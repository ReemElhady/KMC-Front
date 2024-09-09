import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/@shared/services/product.service';
import { Branches, Brands } from 'src/app/models/product-filter.model';
import {
  Product,
  ProductItem,
  ProductType,
} from 'src/app/models/products.models';
import { AppType } from 'src/app/models/type.model';
import {
  FilterProductActions,
  ProductActions,
} from 'src/app/store/product/product-action';
import SwiperCore, { Pagination, Navigation, Autoplay } from 'swiper';

SwiperCore.use([Pagination, Navigation, Autoplay]);

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DevicesComponent implements OnInit, OnDestroy {
  productsContent!: Product;
  // productsContent:  any=[];
  filterLoading: boolean = false;
  isLoading: boolean = false;
  PaginateisLoading: boolean = false;
  productSub!: Subscription;
  currentPage = 0;
  pagesCount = 0;
  typeId!: number;
  branches: Branches[] = [];
  brands: Brands[] = [];
  header: AppType = {
    id: 0,
    name: '',
    image: '',
  };
  branchList: number[] = [];
  subBranchList: number[] = [];
  brandList: [] = [];
  productsUrl: string = '';
  private unSubscribe!: Subscription;
  /////////
  branchChecks: any = [];
  subBranchChecks: any = {};
  brandsChecks: any = [];
  productsContentExists: any;

  listArray: string[] = [];
  sum = 20;
  direction = '';
  checked: any;

  constructor(
    // private http: HttpClient,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private store: Store<{ types: AppType; products: ProductType }>,
    private cs: CookieService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res) => {
      this.typeId = res['id'];
      this.resetFilters(false);
      this.getProducts();
      this.filtersList();
      this.store.select('types').subscribe((res: any) => {
        if (res) {
          this.header = res.filter(
            (type: AppType) => type.id == this.typeId
          )[0];
        }
      });
    });
  }

  getProducts() {
    this.productsUrl = `api/product/?type=${this.typeId}`;
    this.productSub = this.store
      .select('products')
      .subscribe((products: any) => {
        try {
          if (products[this.typeId].results)
            this.productsContent = products[this.typeId];
          this.productsContentExists = Object.keys(
            this.productsContent.results
          ).length;
        } catch (error) {
          this.sendRequest(this.productsUrl);
        }
      });
  }
  sendRequest(url: string, paginations: string = '') {
    if (paginations) {
      url = `api/${paginations}`;
      this.PaginateisLoading = true;
    } else {
      this.isLoading = true;
    }
    this.unSubscribe = this.productService.getProduct(url).subscribe(
      (res) => {
        let data: any = {};
        data[this.typeId] = res;
        if (
          (this.branchList.length ||
            this.brandList.length ||
            this.subBranchList.length) &&
          !paginations
        ) {
          this.store.dispatch(new FilterProductActions(data));
        } else {
          this.store.dispatch(new ProductActions(data));
        }
        this.isLoading = false;
        this.PaginateisLoading = false;
      },
      (errors) => {
        this.isLoading = false;
        this.PaginateisLoading = false;
      }
    );
  }
  paginate() {
    this.sendRequest(
      this.productsUrl,
      this.productsContent.next.split('/api/')[1]
    );
  }

  filtersList() {
    this.productService
      .filterList(`api/product/branches-brands/${this.typeId}`)
      .subscribe((res) => {
        this.branches = res.branches;
        this.brands = res.brands;
        this.branches.forEach((val: any) => {
          this.branchChecks.push(false);
          this.subBranchChecks[val.id] = [];
          val.branch_sub_branches.forEach((sub: any) => {
            this.subBranchChecks[val.id].push(false);
          });
        });
        this.brands.forEach((val) => {
          this.brandsChecks.push(false);
        });
      });
  }
  filterBy(id: number, category: any) {
    // this.filterLoading=true;
    let branchIndex = category.findIndex((branchId: any) => branchId == id);
    this.productsUrl = `api/product/?type=${this.typeId}`;
    if (branchIndex === -1) {
      category.push(id);
    } else {
      category.splice(branchIndex, 1);
    }
    if (this.branchList.length) {
      let branchString = this.branchList.join(',');
      this.productsUrl = this.productsUrl.concat(`&branch=${branchString}`);
    }

    if (this.subBranchList.length) {
      let subBranchString = this.subBranchList.join(',');
      this.productsUrl = this.productsUrl.concat(
        `&sub_branch=${subBranchString}`
      );
    } else {
      this.productsUrl = `api/product/?type=${this.typeId}`;
    }

    if (this.brandList.length) {
      let brandString = this.brandList.join(',');
      this.productsUrl = this.productsUrl.concat(`&brand=${brandString}`);
    }
    this.sendRequest(this.productsUrl);
  }
  resetFilters(init: any = true) {
    this.branchList = [];
    this.brandList = [];
    this.subBranchList = [];
    this.productsUrl = `api/product/?type=${this.typeId}`;
    if (init) {
      for (let i = 0; i < this.branchChecks.length; i++)
        this.branchChecks[i] = false;
      for (let i = 0; i < this.brandsChecks.length; i++)
        this.brandsChecks[i] = false;

      Object.keys(this.subBranchChecks).forEach((key) => {
        for (let i = 0; i < this.subBranchChecks[key].length; i++)
          this.subBranchChecks[key][i] = false;
      });
      this.sendRequest(this.productsUrl);
    }
  }
  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  onScrollDown(ev: any) {
    this.paginate();
  }

  checkedAllBranchFilter(id: any, index: any) {
    this.branchChecks[index] = !this.branchChecks[index];
    let subBranchIds: Number[] = [];
    this.branches[index].branch_sub_branches.map((val: any) => {
      subBranchIds.push(val.id);
      if (this.branchChecks[index]) {
        this.subBranchList.push(val.id);
      }
    });
    if (!this.branchChecks[index]) {
      this.subBranchList = this.subBranchList.filter((arr) => {
        return !subBranchIds.includes(arr);
      });
    }
    this.subBranchChecks[id] = this.subBranchChecks[id].map(
      (val: any) => this.branchChecks[index]
    );
    this.filterBy(id, this.branchList);
  }
  checkSubBranch(id: number, index: any) {
    this.subBranchChecks[index];

    setTimeout(
      () => {
        let subBranch = this.subBranchChecks[id].filter((val: any) => {
          return val == false;
        });

        if (subBranch.length == this.subBranchChecks[id].length) {
          this.branchChecks[index] = false;
        }

        if (subBranch.length === 0) {
          this.branchChecks[index] = true;
        }
      },

      100
    );
  }
  ngOnDestroy(): void {
    if (this.productSub) this.productSub.unsubscribe();
  }
}
