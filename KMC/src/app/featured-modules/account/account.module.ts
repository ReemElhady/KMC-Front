import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginAndSecurityComponent } from './account/login-and-security/login-and-security.component';
import { AddressesComponent } from './account/addresses/addresses.component';
import { PointsComponent } from './account/points/points.component';
import { ShippingComponent } from './account/shipping/shipping.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/@shared/shared.module';
import { AccountComponent } from './account/account.component';
import { OrdersComponent } from './account/orders/orders.component';
import { RefundComponent } from './account/refund/refund.component';


@NgModule({
  declarations: [
    LoginAndSecurityComponent,
    AddressesComponent,
    PointsComponent,
    ShippingComponent,
    AccountComponent,
    OrdersComponent,
    RefundComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    NgbModule,
    SharedModule
  ]
})
export class AccountModule { }
