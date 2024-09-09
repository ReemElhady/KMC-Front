import { HttpClient } from '@angular/common/http'
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { CookieService } from 'ngx-cookie-service'
import { HttpService } from 'src/app/@shared/http/http.service'
import { ProductService } from 'src/app/@shared/services/product.service'
import jwt_decode from 'jwt-decode'
import { ProductDetails, ProductItemSpec, ProductReview, ProductType, Review } from 'src/app/models/products.models'
import { SingleProductActions } from 'src/app/store/product/product-action'
import { ProductReviewAddActions, ProductReviewDeleteActions, ProductReviewGetActions, } from 'src/app/store/reviews/reviews-action'
import SwiperCore, { Pagination, Navigation, Thumbs, FreeMode, Autoplay, SwiperOptions, } from 'swiper'
import { CartService } from 'src/app/@shared/cart.service';
import { Subscription } from 'rxjs';
import { imgUrl } from '../../../../@shared/http/http.service';
import { style } from '@angular/animations'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

SwiperCore.use([Pagination, Navigation])
SwiperCore.use([FreeMode, Navigation, Thumbs, Pagination, Autoplay])

declare var UIkit: any;


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  id: string = ''
  typeId!: number
  isLoading: boolean = false
  count: number = 1
  // productDetailsContent!: ProductDetails
  productDetailsContent!: any
  numberofLength!: number;
  thumbsSwiper: any
  reviewForm!: FormGroup
  productReview: ProductReview[] = []
  producrRate: number = 0
  rateCheck: boolean = true
  userID!: number
  nextReviewPage: number = 1;
  paginationIsloading: boolean = false;
  productsList!: ProductType;
  productSub!: Subscription;
  sliderNumber: number = 4;
  imgUrl = imgUrl;
  selectedItem!: ProductItemSpec;
  option: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 13,

    breakpoints: {
      1200: {
        slidesPerView: 3,
        spaceBetween: 5,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
    },
  };
  selectItemError: boolean = false; constructor(
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private cs: CookieService,
    private httpService: HttpService,
    private store: Store<{ products: ProductType, productReviews: ProductReview[] }>,
    private productService: ProductService,
    private router: Router,
    private modalService: NgbModal
  ) { }


  ngOnInit(): void {
    if (window.innerWidth < 767) {
      this.sliderNumber = 1;
    }
    const token: any = this.cs.get('token') ? jwt_decode(this.cs.get('token')) : -1
    this.userID = token == -1 ? -1 : token['id']
    this.getData()
    this.createForm()


    if (window.innerWidth < 767) {
      this.sliderNumber = 1;
    }
  }
  open(content: any) {
    this.modalService.open(content)
  }
  removeWishlist(id: string) {
    this.productService
      .deleteWishlist(this.typeId, id)
      .subscribe((res) => {
        try {
          this.productDetailsContent.is_wishlist = false;

        }
        catch (err) {

        }
      })
  }

  addProductRoWighlist(id: string) {
    if (!this.httpService.isAuthenticated) {
      this.router.navigate(['/auth', 'login'])
      return
    }
    this.productService
      .addToWishlist(this.productDetailsContent.type, id)
      .subscribe((res: any) => {
        try {
          this.productDetailsContent.is_wishlist = true;
        }
        catch (err) {

        }
      })
  }
  getData() {
    this.activatedRoute.params.subscribe((res) => {

      this.id = res['id']
      this.typeId = res['typeId']
      this.store.select('productReviews').subscribe((reviews) => {
        if (reviews) {
          let review_list = reviews.filter((arr) => arr.product == this.id)
          review_list = review_list.sort((x: any, y: any) => {
            if (x.user == this.userID) {
              return -1
            }
            else {
              return 1
            }
          });
          this.productReview = review_list.filter((value, index, self) => index === self.findIndex((t: any) => (t.id === value.id)))
        }
      })
      this.productSub = this.store.select('products').subscribe((products) => {

        this.productsList = products;
        if (products) {
          if (!products[this.typeId]) {
            this.sendReq(false, false)
          } else {
            let existsProudcts = products[this.typeId].results[this.id]
            if (existsProudcts) {
              if (!existsProudcts.product_image?.length) {
                this.sendReq(true)
              } else {
                this.productDetailsContent = existsProudcts
              }
            }
            else {
              this.sendReq(false, false)
            }
          }
        } else {
          this.sendReq(false, false)
        }
      })
    })
  }
  selectProductItem(productItem: ProductItemSpec) {
    this.selectedItem = productItem;
    UIkit.dropdown('#drop').hide(0);
    this.selectItemError = false;
  }
  sendReq(dispatch: boolean = false, isState: boolean = true) {
    this.isLoading = true
    this.productSub = this.httpService
      .getReq(`api/product/details/${this.id}`)
      .subscribe((res: any) => {
        if (!isState) {
          this.productDetailsContent = res
        }
        if (dispatch) {
          this.store.dispatch(new SingleProductActions(res))
        }
        this.store.dispatch(new ProductReviewGetActions(res.reviews_list))
        this.isLoading = false
      })
  }

  createForm() {
    this.reviewForm = new FormGroup({
      content: new FormControl(null, {
        updateOn: 'change',
      }),
      // rate: new FormControl(3, {
      //   validators: [Validators.required]
      // })
    })
  }

  rateValue(rate: number) {
    if (rate === 0) {
      this.rateCheck = true
    } else {
      this.rateCheck = false
    }
    this.producrRate = rate
  }

  doReview() {
    if (!this.producrRate) {
      return
    }
    if (this.cs.get("token")) {
      const body = {
        product_id: this.id,
        content: this.reviewForm.value.content,
        rate: this.producrRate,
      }
      this.isLoading = true;
      this.httpService
        .postReq('api/product/review', body)
        .subscribe((res: any) => {
          this.reviewForm.reset()
          this.store.dispatch(new ProductReviewAddActions(res.review))
          this.productDetailsContent = { ...this.productDetailsContent }
          this.productDetailsContent.reviewed = true
          if (this.productDetailsContent.reviews_count) {
            this.productDetailsContent.reviews_count += 1
          }
          this.productDetailsContent.rate = res.product_rate
          this.isLoading = false;
        }, errorRes => {
          this.isLoading = false;

        })
    } else {
      this.router.navigate(["/auth", "login"])
    }
  }
  deleteReview() {
    this.isLoading = true;
    this.httpService
      .deleteReq(`api/product/review/${this.id}`)
      .subscribe((res: any) => {
        this.isLoading = false;
        this.store.dispatch(new ProductReviewDeleteActions(this.userID))
        this.productDetailsContent = { ...this.productDetailsContent }
        this.productDetailsContent.reviewed = false
        if (this.productDetailsContent.reviews_count) {

          this.productDetailsContent.reviews_count -= 1
        }
        this.productDetailsContent.rate = res.product_rate
      }, errors => {
        this.isLoading = false;
      })
  }



  counter(x: number) {
    if (this.count === 1 && x === -1) {
      return
    }
    this.count += x;
  };
  addToCart() {    
    if (!this.selectedItem && this.productDetailsContent.product_item.length) {
      this.selectItemError = true;
      return
    }
    this.cartService.addToCart(this.productDetailsContent, this.count, this.selectedItem).subscribe((value: any) => {
      this.count = 1;
      UIkit.notification({
        message: this.cs.get('language') == 'ar' ? 'تم اضافة المنتج الي السلة' : 'added to cart successfully',
        status: 'success',
        pos: 'top-center',
        timeout: 5000
      });

    }, (error) => {
      if (error.status == 400 && error.error["error"]) {
        UIkit.notification({
          message: this.cs.get('language') == 'ar' ? 'الكمية اكثر من المتاح في المخزن' : 'item is out of stock',
          status: 'danger',
          pos: 'top-center',
          timeout: 5000
        });
      }


    })

  }

  sendPagnationRequestReview() {
    this.nextReviewPage = this.productReview.length / 10
    if (this.productReview) {
      this.paginationIsloading = true;
      this.httpService
        .getReq(
          `api/product/review/${this.id}?offset=${this.nextReviewPage * 10}`,
        )
        .subscribe((res: any) => {
          this.nextReviewPage += 1;
          this.paginationIsloading = false;

          this.store.dispatch(new ProductReviewGetActions(res.results))
        })
    }

  }
  onMoveImage(event: any) {

    let x = (event.pageX - event.target.offsetLeft) / (event.target.offsetWidth * 100);
    let y = (event.pageY - event.target.offsetTop) / (event.target.offsetHeight * 100);
    event.target.style.transformOrigin =
      (x * 6000) + '% ' + (y * 6000) + '%';
    // for(let i=0; i<event.length;i++){

    //   event.target[i].style.transformOrigin =
    //     (x*6000) + '% ' + (y*6000) + '%';
    // }


  }

  onOutImage() {
    // document.getElementsByClassName('img_producto').style.transform = 'scale(1)'
    // const nodeList = document.querySelectorAll(".img_producto");
    // (document.querySelector('.img_producto') as HTMLElement).style.transform = 'scale(1)'

    let lists = document.querySelectorAll<HTMLElement>("img_producto");
    for (let i = 0; i < 5; i++) {
      (document.getElementById(`sarsoora${i}`) as HTMLElement).style.transform = 'scale(1)'

      // lists[i].style.transform = 'scale(1)';
      // document.querySelectorAll<HTMLElement>("img_producto")[i].style.transform='scale(1)';


    }
    // (document.querySelector('.img_producto') as HTMLElement).style.transform = 'scale(1)'
    // (document.getElementById("sarsoora") as HTMLElement).style.transform = 'scale(1)'


  }
  onOverImage() {
    let lists = document.querySelectorAll<HTMLElement>("img_producto");
    for (let i = 0; i < 5; i++) {
      // lists[i].style.transform = 'scale(1.6)';
      (document.getElementById(`sarsoora${i}`) as HTMLElement).style.transform = 'scale(1)'

      // document.querySelectorAll<HTMLElement>("img_producto")[i].style.transform='scale(1.6)';

    }

    //  document.getElementsByClassName('img_producto').style.transform= 'scale(1.6)';
    // (document.querySelector('.img_producto') as HTMLElement)
    // .style.transform= 'scale(1.6)';
    // (document.getElementById("sarsoora") as HTMLElement).style.transform = 'scale(1)'

  }





  ngOnDestroy(): void {
    if (this.productSub) {
      this.productSub.unsubscribe()
    }
  }
}
