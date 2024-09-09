import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  declarations: [AboutUsComponent],
  imports: [CommonModule, AboutUsRoutingModule, SwiperModule, SharedModule],
})
export class AboutUsModule {}
