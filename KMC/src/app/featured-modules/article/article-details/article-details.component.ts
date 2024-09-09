import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { Subscription } from 'rxjs'
import { HttpService } from 'src/app/@shared/http/http.service'
import { Article } from 'src/app/models/article-model'
import { ArticleDetailsAction } from 'src/app/store/articles/article-action'

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss'],
})
export class ArticleDetailsComponent implements OnInit {
  isLoading: boolean = false
  id!: string
  articleDeatailsContent!: any
  private unSubscribe!: Subscription
  constructor(
    private activatedR: ActivatedRoute,
    private http: HttpService,
    private store: Store<{ articleDatails: Article[] }>,
  ) { }

  ngOnInit(): void {
    this.getArticleDetails()
  }

  getArticleDetails() {
    this.activatedR.params.subscribe(
      res => {
        this.id = res['id']
        this.store.select('articleDatails').subscribe(articles => {
          if (articles) {
            let ourArticles =
              articles.filter((article: Article) => article.id == this.id);
            if (ourArticles.length)
              this.articleDeatailsContent = ourArticles[0]
            else {
              this.getOneArticle()
                   }
          }
          if (!articles) {
            this.getOneArticle()
          }

        })
      }
    )

  }
  getOneArticle() {
    if (!this.articleDeatailsContent) {
      this.isLoading = true
      this.http.getReq(`api/article/${this.id}`).subscribe((res: any) => {
        this.store.dispatch(new ArticleDetailsAction(res))
        this.articleDeatailsContent = res
        this.isLoading = false
      })
    }
  }

  ngOnDestroy(): void {
    if (this.unSubscribe) {
      this.unSubscribe.unsubscribe()
    }
  }


}