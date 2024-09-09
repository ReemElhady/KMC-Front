import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FooterAboutActions } from 'src/app/store/footer/footer.actions';
import { Store } from '@ngrx/store';
import { Footer } from 'src/app/models/footer.model';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/@shared/http/http.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  private fragment!: any;
  data!: Footer;
  isLoading: boolean = false;
  private unSubscribe!: Subscription;

  constructor(
    private router: ActivatedRoute,
    private store: Store<{
      footer: Footer;
    }>,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((params: any) => {
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
    });
  }
  ngOnDestroy(): void {
    this.unSubscribe.unsubscribe();
  }
}
