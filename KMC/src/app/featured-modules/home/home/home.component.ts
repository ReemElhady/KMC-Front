import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HttpService, imgUrl } from 'src/app/@shared/http/http.service';
import { Home } from 'src/app/models/home.model';
import { ProductType } from 'src/app/models/products.models';
import { AppType } from 'src/app/models/type.model';
import { HomeAction } from 'src/app/store/home/home-action';
import { environment } from 'src/environments/environment';
import { interval } from 'rxjs';
import { CartService } from 'src/app/@shared/cart.service'; 
declare var UIkit: any;
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
  imgUrl = imgUrl;
  flashSale: any = null;
  private routerSubscription!: Subscription;
  private storeSubscription!: Subscription;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  @Input('article') atricle!: any;
  homeContent!: any;
  private unSubscribe!: Subscription;
  isLoading: boolean = false;
  latestArticles: any[] = [];
  // imgurl = environment.baseUrl + '/';
  imageUrl = imgUrl;
  productsList!: ProductType;
  lowStockProducts =[];
  firstElment: any;
  types: any;
  keys!: any;
  cookies: boolean = false;
  isMobile: boolean = false;
  isCollaspse: boolean = false;
  option: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 13,
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 70,
      },
    },
  };
  optionCategories: SwiperOptions = {
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
  // Adjusted options for articles Swiper on mobile
  optionArticles: SwiperOptions = {
    slidesPerView: 1,  // Show 1 article at a time
    spaceBetween: 10,
    autoplay: {
      delay: 3000,  // Adjust for swipe speed
      disableOnInteraction: false,
    },
    pagination: { clickable: true },
  };
  
  constructor(
    private store: Store<{
      home: Home;
      products: ProductType;
      types: AppType[];
    }>,
    private http: HttpService,
    private router: Router,
    private cartService: CartService,
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
  private countdownSubscription!: Subscription;
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
    this.getFlashSaleData();
   
    this.store.select('types').subscribe((res: AppType[]) => {
      if (res) {
        this.types = res;
        // console.log(">>>>>>>>>>>>>>>",res.slice(0, 1))
        // this.firstElment = res.slice(0, 1);
        // this.types = res.slice(1);
      }
    });
    // this.startCountdown(new Date('2024-12-25T00:00:00'));

    // Detect navigation back to home
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/') {
        this.getFlashSaleData();
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
            this.flashSale = res.flash_sale;
            // console.log('Low Stock Products:', this.homeContent?.Low_Stock_Products);
            // console.log('Popular Products:', this.homeContent?.Popular_Products);
            // console.log('Brands:', this.homeContent?.Brands); 
            });
      }
    });
    this.store.select('products').subscribe((products) => {
      this.productsList = products;
    });

  } 
  getFlashSaleData() {
    this.storeSubscription = this.store.select('home').subscribe((home) => {
      if (home) {
        this.flashSale = home.flash_sale;
        // console.log('Flash Sale from Store:', this.flashSale);
        if (this.flashSale && this.flashSale.end_date) {
          this.startCountdown(this.flashSale.end_date);
        } else {
          // console.error('Flash Sale data is invalid:', this.flashSale);
        }
      } else {
        this.http.getReq('api/home/').subscribe((res: Home) => {
          this.store.dispatch(new HomeAction(res));
          this.flashSale = res.flash_sale;
          // console.log('Flash Sale from API:', this.flashSale);
          if (this.flashSale && this.flashSale.end_date) {
            this.startCountdown(this.flashSale.end_date);
          } else {
            // console.error('Flash Sale data from API is invalid:', this.flashSale);
          }
        });
      }
    });
  }
  
  // fetchProductsByBrand(brandId: number): void {
  //   this.http.getReq(`api/product/by-brand/${brandId}`).subscribe(
  //     (products) => {
  //       console.log('Products:', products);
  //       // Update your component state to display these products
  //     },
  //     (error) => {
  //       console.error('Error fetching products:', error);
  //     }
  //   );
  // }
  
  startCountdown(endDate: string) {
    if (!endDate) {
      return;
    }
  
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe(); // Ensure no overlapping subscriptions
    }
  
    const endDateTime = new Date(endDate).getTime();
  
    this.countdownSubscription = interval(1000).subscribe(() => {
      const now = new Date().getTime();
      const timeLeft = endDateTime - now;
  
      if (timeLeft > 0) {
        this.days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      } else {
        this.countdownSubscription.unsubscribe();
        // Optionally handle post-sale behavior
      }
    });
  }
  
// Method to handle adding to cart with or without modal
addToCartOrModal(product: any): void {
  const modalElement = document.getElementById(`modal-example-${product.id}`);
  // console.log('Modal Element:', modalElement); // Debug log
  if (modalElement) {
    try {
      UIkit.modal(modalElement).show();
    } catch (error) {
      // console.error('UIkit modal initialization error:', error);
    }
  } else {
    // console.warn('Modal element not found for product:', product);
    this.addToCart(product);
  }
}


// Method to add product to cart
addToCart(product: any): void {
  if (product.product_item?.length && !product.selectedItem) {
    UIkit.notification({
      message: 'Please select an item first.',
      status: 'warning',
      pos: 'top-center',
      timeout: 5000
    });
    return;
  }

  this.cartService.addToCart(product, 1, product.selectedItem).subscribe(
    (value: any) => {
      UIkit.notification({
        message: 'Product added to cart successfully!',
        status: 'success',
        pos: 'top-center',
        timeout: 5000
      });
    },
    (error) => {
      if (error.status === 400 && error.error['error']) {
        UIkit.notification({
          message: 'Quantity exceeds available stock.',
          status: 'danger',
          pos: 'top-center',
          timeout: 5000
        });
      }
    }
  );
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
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    this.routerSubscription?.unsubscribe();
    this.storeSubscription?.unsubscribe();
  }

  openSearch(): void {
    this.isCollaspse = !this.isCollaspse;
  }

  navigateToBrandProducts(brandId: number): void {
    this.router.navigate(['/products/brand', brandId]);
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


