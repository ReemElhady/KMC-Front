import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './@shared/components/layout/layout/layout.component';
import { NotFoundComponent } from './@shared/not-found/not-found.component';
import { SearchComponent } from './@shared/search/search.component';
import { AuthGuard } from './guards/auth.guard';
import { CartGuard } from './guards/cart.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./featured-modules/home/home.module').then(
            (m) => m.HomeModule
          ),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./core/auth/auth.module').then((m) => m.AuthModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'about-us',
        loadChildren: () =>
          import('./featured-modules/about-us/about-us.module').then(
            (m) => m.AboutUsModule
          ),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./featured-modules/account/account.module').then(
            (m) => m.AccountModule
          ),
        canActivate: [AuthGuard],
      },

      {
        path: 'articles',
        loadChildren: () =>
          import('./featured-modules/article/article.module').then(
            (m) => m.ArticleModule
          ),
      },

      {
        path: 'cart',
        loadChildren: () =>
          import('./featured-modules/cart/cart.module').then(
            (m) => m.CartModule
          ),
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('./featured-modules/checkout/checkout.module').then(
            (m) => m.CheckoutModule
          ),
        canActivate: [AuthGuard, CartGuard],
      },
      {
        path: 'contact-us',
        loadChildren: () =>
          import('./featured-modules/contact-us/contact-us.module').then(
            (m) => m.ContactUsModule
          ),
      },
      {
        path: 'materials',
        loadChildren: () =>
          import('./featured-modules/materials/materials.module').then(
            (m) => m.MaterialsModule
          ),
      },
      {
        path: 'policy',
        loadChildren: () =>
          import('./featured-modules/policy/policy.module').then(
            (m) => m.PolicyModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./featured-modules/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: 'tools',
        loadChildren: () =>
          import('./featured-modules/tools/tools.module').then(
            (m) => m.ToolsModule
          ),
      },
      {
        path: 'wishlist',
        loadChildren: () =>
          import('./featured-modules/wishlist/wishlist.module').then(
            (m) => m.WishlistModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'courses',
        loadChildren: () =>
          import('./featured-modules/courses/courses.module').then(
            (m) => m.CoursesModule
          ),
      },

      {
        path: 'search/:searched',
        component: SearchComponent,
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
  // {
  //   path: 'errors',
  //   loadChildren: () =>
  //     import('./featured-modules/errors/errors.module').then(
  //       (m) => m.ErrorsModule
  //     )
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
