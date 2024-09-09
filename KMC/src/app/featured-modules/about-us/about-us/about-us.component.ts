import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HttpService, imgUrl } from 'src/app/@shared/http/http.service';
import { AboutUs } from 'src/app/models/about-us.model';
import { StoreAboutActions } from 'src/app/store/about-us/about-us-action';
import SwiperCore, { Autoplay, Pagination, SwiperOptions } from 'swiper';

SwiperCore.use([Pagination, Autoplay]);

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AboutUsComponent implements OnInit, OnDestroy {
  aboutUsContent!: AboutUs;
  private unSubcribe!: Subscription;
  imgUrl = imgUrl;
  config: SwiperOptions = {
    slidesPerView: 0.8,
    spaceBetween: 10,
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 2.4,
      },
      1400: {
        slidesPerView: 2.7,
      },
      1600: {
        slidesPerView: 3,
      },
    },
  };
  isLoading: boolean = false;
  constructor(
    private store: Store<{ aboutUs: AboutUs }>,
    private sttpService: HttpService
  ) {}
  ngOnInit(): void {
    this.store.select('aboutUs').subscribe((aboutus) => {
      this.aboutUsContent = aboutus;
      if (!this.aboutUsContent) {
        this.isLoading = true;
        this.unSubcribe = this.sttpService
          .getReq('api/about-us')
          .subscribe((res: AboutUs) => {
            this.store.dispatch(new StoreAboutActions(res));
            this.isLoading = false;
          });
      }
    });
  }
  ngOnDestroy(): void {
    if (this.unSubcribe) {
      this.unSubcribe.unsubscribe();
    }
  }
}
