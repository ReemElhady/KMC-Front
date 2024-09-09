import { AccountAddresses } from '../models/accounts-addresses.model';
import { addressesReducer } from './accounts/addresses/addresses-reducer';
import { loginSecurityReducer } from './accounts/login-security/login-security-reducer';
import { LoginSecurity } from '../models/login-security.model';
import { ActionReducerMap } from '@ngrx/store';
import { AboutUs } from '../models/about-us.model';
import { CreateAccount, TokensModel } from '../models/auth-models';
import { CourseBranch } from '../models/branch.model';
import { ContactUs } from '../models/contact-us.model';
import { CoursesList } from '../models/course-list.model';
import { Course } from '../models/course-model';
import { AppType } from '../models/type.model';
import { aboutUsReducer } from './about-us/about-us-reducer';
import { tokenReducer } from './auth/auth-reducer';
import { createAccountReducer } from './auth/create-caccount-reducer';
import { contactUsReducer } from './contact-us/contact-us-reducer';
import { branchReducer } from './branches/branches-reducer';
import { CartItem, OrderSammary } from 'src/app/models/cart.model';
import {
  CourseDetailsReducer,
  listReducer,
} from './course-list/course-list-reducer';
import { courseReducer } from './courses/courses-reducer';
import { typeReducer } from './types/type-reducer';
import { cartReducer, orderSummaryReducer } from './cart/cart.reducer';
import { OrderInterface } from '../models/order.model';
import { orderReducer } from './order/order.reducer';
import {
  ProductDetails,
  ProductReview,
  ProductType,
  salesInterface,
} from '../models/products.models';
import { productReducer } from './product/product-reducer';
import { Article, Articles } from '../models/article-model';
import {
  articleDeatilsReducer,
  articleReducer,
} from './articles/article-reducer';
import { Points } from '../models/points.model';
import { pointsReducer } from './accounts/points/points-reducer';
import { Home } from '../models/home.model';
import { homeReducer } from './home/home-reducer';
import { WishList } from '../models/wishlist.model';
import { wishlistReducer } from './wishlist/wishlist-reducer';
import { productReviewReducer } from './reviews/reviews-reducer';
import { SalesReducer } from './sales/sales-reduces';
import { Footer } from '../models/footer.model';
import { footerReducer } from './footer/footer.reducer';
import { Faq } from '../models/faq.model';
import { faqReducer } from './faq/faq.reducers';

export interface AppState {
  tokens: TokensModel;
  aboutUs: AboutUs;
  contactUs: ContactUs;
  createAccoutn: CreateAccount;
  accountAddresses: AccountAddresses[];
  accountLogin: LoginSecurity;
  course: Course[];
  types: AppType[];
  branches: CourseBranch[];
  courseDetails: CoursesList[];
  courseList: CoursesList[];
  points: Points;
  article: Articles;
  cart: CartItem[];
  orderSummay: OrderSammary;
  orders: OrderInterface;
  // productReviews: ProductReview[];
  articleDatails: Article[];
  home: Home;
  wishlist: WishList;
  products: ProductType;
  sales: salesInterface;
  footer: Footer;
  faq: Faq[];
}

export const reducers: ActionReducerMap<AppState, any> = {
  tokens: tokenReducer,
  aboutUs: aboutUsReducer,
  contactUs: contactUsReducer,
  createAccoutn: createAccountReducer,
  accountAddresses: addressesReducer,
  accountLogin: loginSecurityReducer,
  articleDatails: articleDeatilsReducer,
  course: courseReducer,
  types: typeReducer,
  branches: branchReducer,
  courseList: listReducer,
  courseDetails: CourseDetailsReducer,
  cart: cartReducer,
  orderSummay: orderSummaryReducer,
  orders: orderReducer,
  products: productReducer,
  // productReviews: productReviewReducer,
  article: articleReducer,
  points: pointsReducer,
  home: homeReducer,
  wishlist: wishlistReducer,
  // points:pointsReducer
  sales: SalesReducer,
  footer: footerReducer,
  faq: faqReducer,
};
