import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookDemoComponent } from './book-demo/book-demo.component';


const routes: Routes = [
  {
    path: '', component: BookDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookDemoRoutingModule { }
