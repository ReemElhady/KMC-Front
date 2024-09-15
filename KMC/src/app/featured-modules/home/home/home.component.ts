import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/@shared/http/http.service';
import { Home } from 'src/app/models/home.model';
import { ProductType } from 'src/app/models/products.models';
import { AppType } from 'src/app/models/type.model';
import { HomeAction } from 'src/app/store/home/home-action';
import { environment } from 'src/environments/environment';
import { imgUrl } from 'src/app/@shared/http/http.service';

import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  SwiperOptions,
} from 'swiper';

// install Swiper modules
SwiperCore.use([Pagination, Autoplay, Navigation]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  @Input('article') atricle!: any;
  homeContent!: any;
  private unSubscribe!: Subscription;
  isLoading: boolean = false;
  latestArticles: any[] = [];
  // imgurl = environment.baseUrl + '/';
  imageUrl = imgUrl;
  productsList!: ProductType;
  firstElment: any;
  types: any;
  keys!: any;
  cookies: boolean = false;
  isMobile: boolean = false;
  isCollaspse: boolean = false;
  option: SwiperOptions = {
    slidesPerView: 2.2,
    spaceBetween: 13,
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 70,
      },
    },
  };
  optionArticles: SwiperOptions = {
    slidesPerView: 2.2,
    spaceBetween: 13,
    // breakpoints: {
    //   768: {
    //     slidesPerView: 1.2,
    //     spaceBetween: 13,
    //   },
    // },
  };
  // MYSwiper: SwiperOptions = {
  //   pagination: true,
  //   navigation: true,
  // };
  MYSwiper: SwiperOptions = {
    pagination: true,
    navigation: true,
    autoplay: {
      delay: 5000, // 5000ms = 5 seconds
      disableOnInteraction: false, // Keeps autoplay running even after user interactions
    },
  };
  
  constructor(
    private store: Store<{
      home: Home;
      products: ProductType;
      types: AppType[];
    }>,
    private http: HttpService,
    private router: Router
  ) {
    if (window.innerWidth < 767) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth < 767) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
      // console.log('is pc', this.isMobile);
    });
  }
  ngOnInit(): void {
    if (
      !localStorage.getItem('cookieSeen') ||
      localStorage.getItem('cookieSeen') === 'true'
    ) {
      setTimeout(() => {
        localStorage.setItem('cookieSeen', 'true');
        this.cookies = true;
      }, 1000);
    }

    this.getAllData();
    this.store.select('types').subscribe((res: AppType[]) => {
      if (res) {
        this.types = res;

        // this.firstElment = res.slice(0, 1);
        // this.types = res.slice(1);
      }
    });
  }

  //get all data
  getAllData() {
    this.store.select('home').subscribe((home) => {
      this.homeContent = home;
      if (!this.homeContent) {
        this.isLoading = true;
        this.unSubscribe = this.http
          .getReq('api/home/')
          .subscribe((res: Home) => {
            this.store.dispatch(new HomeAction(res));
            this.isLoading = false;
          });
      }
    });
    this.store.select('products').subscribe((products) => {
      this.productsList = products;
    });
  }

  cookienotApper() {
    localStorage.setItem('cookieSeen', 'false');
    this.cookies = false;
  }
  //swiper
  pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '">' + '' + '</span>';
    },
  };
  routeForLink(link: any) {
    if (link) {
      window.open(link);
    }
  }
  ngOnDestroy(): void {
    if (this.unSubscribe) {
      this.unSubscribe.unsubscribe();
    }
  }

  openSearch(): void {
    this.isCollaspse = !this.isCollaspse;
  }

  searchAction(searchedText: string): void {
    if (searchedText.trim()) {
      this.router.navigate(['search', searchedText]);
    } else {
      // Optionally handle empty search text here if needed
    }
  }
  navigateToProducts() {
    this.router.navigate(['./products/shop']);
  }
  navigateToArticles() {
    this.router.navigate(['./articles']);
  }
  navigateToCategories() {
    this.router.navigate(['products', 'shop']);
  }
  navigateToWhyKMC() {
    this.router.navigate(['./about-us']);
  }
}
