import { Action } from "@ngrx/store";
import {Article, Articles } from '../../models/article-model';


export const ARTICLE = 'ARTICLE'
export const ARTICLE_DETAILS = 'ARTICLE_DETAILS'

export class ArticleAction implements Action {
  readonly type = ARTICLE
  constructor(public payload: Articles) { }
}
export class ArticleDetailsAction implements Action {
  readonly type = ARTICLE_DETAILS
  constructor(public payload: Article) { }
}

export type AritcleTypeAction = ArticleAction | ArticleDetailsAction