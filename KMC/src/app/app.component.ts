import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CartService } from './@shared/cart.service';
import { imgUrl } from './@shared/http/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'KMC';
  imgUrl = imgUrl;
  outOfStockError!: any;
  unSubscription!: Subscription;
  errors!: any;
  @ViewChild('openDialog', { static: false }) openBtn!: any;
  constructor(
    private cs: CookieService,
    public cartService: CartService,
    private route: Router,
    private router: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.router.params.subscribe((url: any) => {});
    this.outOfStockError =
      this.cs.get('language') == 'ar'
        ? 'هذه المنتجات ليست متاحه في المخنزن'
        : 'this products is out of stock'; // if(this.cs.get('token')){
    if (this.cs.get('token')) {
      this.cartService.getCartItemsBack().subscribe((res) => {});
    }
    this.unSubscription = this.cartService.errors.subscribe((errors) => {
      this.errors = errors;
      this.openBtn.nativeElement.click();
    });

    this.checkAccessTokenExpiration();
  }
  // fixing scrolling bug

  onActivate(event: Event): void {
    this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const urlArray: Array<any> = event.url.split('/');

        if (!urlArray.includes('policy') || urlArray.includes('faq')) {
          window.scroll(0, 0);
        } else {
          setTimeout(() => {
            const ele: any = document.getElementById(
              `${urlArray[urlArray.length - 1]}`
            );
            if (ele === null) {
              return;
            }
            window.scrollTo({ top: ele.offsetTop - 80 });
          }, 100);
        }
      });
  }
  unsubscribeError() {
    if (this.unSubscription) {
      this.unSubscription.unsubscribe();
    }
  }
  checkAccessTokenExpiration() {
    const token: any = this.cs.get('token')
      ? jwt_decode(this.cs.get('token'))
      : -1;
    const expDate = new Date(0);
    expDate.setUTCSeconds(token.exp)
  }
}
