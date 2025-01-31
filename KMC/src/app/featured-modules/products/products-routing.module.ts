import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevicesComponent } from './products/devices/devices.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { SalesComponent } from './products/sales/sales.component';
import { ShopComponent } from './products/shop/shop.component';
import { BrandProductsComponent } from './products/brand-products/brand-products.component'

const routes: Routes = [
  {
    path: 'brand/:brandId', component: BrandProductsComponent
  },
  {
    path: 'branch/:branchId', component: BrandProductsComponent
  },
  {
    path: 'shop', component: ShopComponent
  },
  {
    path: 'sales', component: SalesComponent
  },
  {
    path: ':id', component: DevicesComponent
  },
  {
    path: 'details/:typeId/:id', component: ProductDetailsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
