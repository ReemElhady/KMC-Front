import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/@shared/shared.module';
import { ArticleRoutingModule } from './article-routing.module';
// import { ArticleItemComponent } from './article-item/article-item.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticlesComponent } from './articles/articles.component';

@NgModule({
  declarations: [
    // ArticleItemComponent,
    ArticleDetailsComponent,
    ArticlesComponent,
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    SharedModule
  ]
})
export class ArticleModule {}
