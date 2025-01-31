import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
// import { ProductItemComponent } from './products/product-item/product-item.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { DevicesComponent } from './products/devices/devices.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/@shared/shared.module';
import { ShopComponent } from './products/shop/shop.component';
import { SwiperModule } from 'swiper/angular';
import { SalesComponent } from './products/sales/sales.component';
import {  SafePipeModule } from 'safe-pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxImageZoomComponent } from 'ngx-image-zoom';
import { BrandProductsComponent } from './products/brand-products/brand-products.component';
// import { NgxImageZoomModule } from 'ngx-image-zoom';


@NgModule({
  declarations: [
    ProductDetailsComponent,
    DevicesComponent,
    ShopComponent,
    SalesComponent,
    BrandProductsComponent,

  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    NgbModule,
    SharedModule,
    // NgxPaginationModule,
    SwiperModule,
    SafePipeModule,
    // BrowserAnimationsModule

  ]
})
export class ProductsModule { }
