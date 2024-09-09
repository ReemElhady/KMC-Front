import { NgModule } from '@angular/core';
import {  ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AddressInfoComponent } from './address-info/address-info.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';

const routes: Routes = [
  {
    path: 'address', component: AddressInfoComponent
  },
  {
    path: 'order/:addresId/:paymentMethod/:points', component: OrderSummaryComponent
  }
];

@NgModule({
  imports: [ReactiveFormsModule,RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
