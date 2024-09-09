import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { AddressInfoComponent } from './address-info/address-info.component';
import { SharedModule } from 'src/app/@shared/shared.module';


@NgModule({
  declarations: [
    CheckoutComponent,
    OrderSummaryComponent,
    AddressInfoComponent,
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    SharedModule
  ]
})
export class CheckoutModule { }
