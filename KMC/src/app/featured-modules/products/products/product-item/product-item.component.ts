// import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CartService } from 'src/app/@shared/cart.service';
import { ProductService } from 'src/app/@shared/services/product.service';
import { Store } from '@ngrx/store';
import { WishList } from 'src/app/models/wishlist.model';
import { HttpService, imgUrl } from '../../../../@shared/http/http.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
declare var UIkit: any;
import { ProductDetails, ProductItemSpec } from 'src/app/models/products.models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input('product') product!: ProductDetails;
  @Input() showPercentage: boolean = false; // Add this line
  imgUrl = imgUrl;
  pointPrice: boolean = false;
  iconClose: boolean = false;
  selectedItem!: ProductItemSpec;
  selectItemError: boolean = false;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cs: CookieService,
    private router: Router,
    private httpService: HttpService,
    private modalService: NgbModal

  ) { }

  ngOnInit(): void {
    if (window.innerWidth < 767) {
      this.iconClose = true;
    }
    else if (window.innerWidth < 1024 && window.innerWidth >= 768) {
      this.iconClose = false;
    }
  }
  open(content: any) {
    this.modalService.open(content)
  }

  selectProductItem(productItem: ProductItemSpec) {
    this.selectedItem = productItem;
    UIkit.dropdown('#drop').hide(0);
    this.selectItemError = false;
  }
  ///add class
  iconCloseHover() {

    // document.querySelector('.product-descraption')?.classList.add('text-descraption-hover');
    let list = document.querySelectorAll<HTMLElement>('.product-descraption');
    let productList = document.querySelectorAll<HTMLElement>('.text-descraption');

    for (let i = 0; i < list.length; i++) {
      list[i].style.backgroundColor = 'transparent';
      productList[i].style.display = 'none';

    }
    // (document.querySelector('.product-descraption') as HTMLElement).style.backgroundColor = 'transparent';
    // (document.querySelector('.text-descraption') as HTMLElement).style.display = 'none';



  }
  togglePointPrice() {
    this.pointPrice = !this.pointPrice;
  }
  addToCartOrModal(product: ProductDetails) {
    if (product.product_item?.length) {
      UIkit.modal(`#modal-example-${product.id}`).show()
      return;
    }
    else {
      this.addToCart(product)
    }
  }
  addToCart(product: ProductDetails) {
    if (this.product.product_item?.length && !this.selectedItem) {      
      this.selectItemError = true;
      return
    }
    this.cartService.addToCart(product, 1, this.selectedItem).subscribe((value: any) => {
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

  addProductToWishlist(id: string) {
    if (!this.httpService.isAuthenticated) {
      this.router.navigate(['/auth', 'login'])
      return
    }
    this.productService.addToWishlist(this.product.type, this.product.id).subscribe((res: any) => {
      try {
        this.product = { ...this.product };
        this.product.is_wishlist = true;
      }
      catch (err) {

      }
    })
  }
  removeWishlist(id: string) {
    this.productService.deleteWishlist(this.product.type, id).subscribe(res => {
      try {
        this.product = { ...this.product };
        this.product.is_wishlist = false;
      }
      catch (err) {

      }

    })
  }
  onActivate(event: Event): void {
    window.scroll(0, 0);
  }
  navigateToDetails(event: Event) {

  }

  getDisplayPrice(product: any): number {
    if (product.sale_percentage) {
      const discount = (product.sale_percentage / 100) * product.price;
      return product.price - discount;
    } else if (product.sale_price) {
      return product.sale_price;
    }
    return product.price;
  }
  
  getDiscountLabel(product: any): string {
    if (product.sale_percentage) {
      // Round to one decimal place
      const roundedPercentage = product.sale_percentage.toFixed(1);
      return `${roundedPercentage}% off`;
    } else if (product.sale_price) {
      // Ensure this case is properly executed
      const discountAmount = (product.price - product.sale_price).toFixed(2);
      return `Save ${discountAmount} EGP`;
    }
    return '';
  }
  
}


