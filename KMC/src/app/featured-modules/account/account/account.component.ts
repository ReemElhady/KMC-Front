import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/@shared/cart.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(public cartService:CartService) { }
  totalPoints:number=0;
  ngOnInit(): void {
    this.cartService.generalsObject.subscribe(res=>{
      if(res.pointValue){
        this.totalPoints=res.points
      }
    })
  }

}
