import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'swiper/angular';
import { FormsLoadingSpinner } from './forms-loading-spinner/forms-loading-spinner.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { ArticleItemComponent } from '../featured-modules/article/article-item/article-item.component';
import { ProductItemComponent } from '../featured-modules/products/products/product-item/product-item.component';
import { RouterModule } from '@angular/router';
import { SafePipeModule } from 'safe-pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxImageZoomModule } from 'ngx-image-zoom';
// import { LayoutComponent } from './components/layout/layout/layout.component';



@NgModule({
  declarations: [
    LoadingScreenComponent,
    FormsLoadingSpinner,
    ArticleItemComponent,
    ProductItemComponent,
    // LayoutComponent,
    ],

  imports: [
    CommonModule,
    TranslateModule,
    SwiperModule,
    RouterModule,
    InfiniteScrollModule,
    NgxImageZoomModule,
    // SafePipeModule
  ],

  exports: [
    ReactiveFormsModule,
    TranslateModule,
    SwiperModule,
    LoadingScreenComponent,
    FormsLoadingSpinner,
    ArticleItemComponent,
    ProductItemComponent,
    FormsModule,
    InfiniteScrollModule,
    NgxImageZoomModule,


  ],
})
export class SharedModule { }

