import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/@shared/http/http.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Faq } from 'src/app/models/faq.model';
import { FaqActions } from 'src/app/store/faq/faq.actions';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FAQComponent implements OnInit, OnDestroy {
  data!: any;
  isLoading = false;
  unSubscribe!: Subscription;
  constructor(
    private http: HttpService,
    private store: Store<{
      faq: Faq[];
    }>
  ) { }

  ngOnInit(): void {
    this.unSubscribe = this.store.select('faq').subscribe((data: Faq[]) => {
      this.data = data;

      if (!this.data) {
        this.isLoading = true;
        this.http.getReq('api/faq').subscribe((res: Faq[]) => {
          this.store.dispatch(new FaqActions(res));

          this.isLoading = false;
        });
      }
    });
  }
  ngOnDestroy(): void {
    this.unSubscribe.unsubscribe();
  }
}
