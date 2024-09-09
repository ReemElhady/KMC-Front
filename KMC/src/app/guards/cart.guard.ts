import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import {  map, Observable, of, switchMap } from 'rxjs';
import { CartService } from '../@shared/cart.service';
import { CartItem } from '../models/cart.model';
import { StoreCartItemsAction } from '../store/cart/cart.actions';

@Injectable({
  providedIn: 'root'
})
export class CartGuard implements CanActivate {
  constructor(
    
    private router: Router,
    private store: Store<{ cart: CartItem[] }>,
    private cartService:CartService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree   {
        
        return this.store.select("cart").pipe(map(cart=>{
        if(!cart){
            this.cartService.getCartItemsBack().subscribe(res=>{
                if(res.cart.cart_items){
                    this.store.dispatch(new StoreCartItemsAction(res.cart.cart_items))
                }
                else{
                    this.store.dispatch(new StoreCartItemsAction(res.cart))
                }
            })
        }
        else if(!cart.length){
            return this.router.createUrlTree(["/"]);
        }
        return true 
        }))

        
  }

}
