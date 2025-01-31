import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookDemoRoutingModule } from './book-demo-routing.module';
import { BookDemoComponent } from './book-demo/book-demo.component';
import { SharedModule } from 'src/app/@shared/shared.module';


@NgModule({
  declarations: [BookDemoComponent],
  imports: [
    CommonModule,
    BookDemoRoutingModule,
    SharedModule
  ]
})
export class BookDemoModule { }
