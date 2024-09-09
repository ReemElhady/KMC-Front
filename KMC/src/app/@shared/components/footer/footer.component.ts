import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ContactUs } from 'src/app/models/contact-us.model';
import { Footer } from 'src/app/models/footer.model';

import { AppType } from 'src/app/models/type.model';
import { ConatcUsAction } from 'src/app/store/contact-us/contact-us-action';
import { HttpService } from '../../http/http.service';

import { FooterAboutActions } from 'src/app/store/footer/footer.actions';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  shopList: AppType[] = [];
  contactUsContent!: ContactUs;
  service!: any;
  data!: any;
  isLoading: boolean = false;
  private unSubscribe!: Subscription;

  constructor(
    private store: Store<{
      types: AppType;
      contactUs: ContactUs;
      footer: Footer;
    }>,
    private route: Router,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    // this.footerService.getOffersData().subscribe((res: Footer) => {
    //   this.data = res;

    // });
    this.store.select('types').subscribe((res: any) => {
      if (res) {
        this.shopList = res.slice(0, 3);
      }
    });

    this.unSubscribe = this.store.select('footer').subscribe((footer) => {
      this.data = footer;
      if (!this.data) {
        this.isLoading = true;
        this.http.getReq('api/footer').subscribe((res: Footer) => {
          this.store.dispatch(new FooterAboutActions(res));

          this.isLoading = false;
        });
      }
    });
  }

  onActivate(event: Event): void {
    window.scroll(0, 0);
  }

  ngOnDestroy(): void {
    this.unSubscribe.unsubscribe();
  }
}
