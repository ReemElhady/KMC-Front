import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/@shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LanguageInterceptor } from 'src/app/language.interceptor';
import { reducers } from 'src/app/store/state.app';
import { StoreModule } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';

import { SwiperModule } from 'swiper/angular';
import { SearchComponent } from 'src/app/@shared/search/search.component';
import { FooterComponent, HeaderComponent } from 'src/app/@shared/components';
import { NotFoundComponent } from 'src/app/@shared/not-found/not-found.component';
import { LayoutComponent } from 'src/app/@shared/components/layout/layout/layout.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';





@NgModule({
  declarations: [
    SearchComponent,
    FooterComponent,
    SearchComponent,
    HeaderComponent,
    LayoutComponent,
    NotFoundComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    SwiperModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule,
    HttpClientModule,
    StoreModule.forRoot(reducers),
    RouterModule,
    InfiniteScrollModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true },
    CookieService,

  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    NotFoundComponent,


  ]
})
export class CoreModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
