import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AccountComponent } from './account/account.component';
import { AddressesComponent } from './account/addresses/addresses.component';
import { LoginAndSecurityComponent } from './account/login-and-security/login-and-security.component';
import { OrdersComponent } from './account/orders/orders.component';
import { PointsComponent } from './account/points/points.component';
import { RefundComponent } from './account/refund/refund.component';
import { ShippingComponent } from './account/shipping/shipping.component';

const routes: Routes = [
  {
    path: '', component: AccountComponent, canActivate: [AuthGuard], children: [
      {
        path: 'addresses', component: AddressesComponent
      },
      {
        path: 'login-and-security', component: LoginAndSecurityComponent
      },
      {
        path: 'orders', component: OrdersComponent
      },
      {
        path: 'orders/refund/:id', component: RefundComponent
      },
      {
        path: 'points', component: PointsComponent
      },
      {
        path: 'shipping', component: ShippingComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
