import {Article,  Articles } from '../../models/article-model';
import * as articleAction from "./article-action";

export let article!: Articles;
export  let articleDatails!:Article[]

export function articleReducer(articleState: Articles = article,
  action: articleAction.AritcleTypeAction): any {
  switch (action.type) {
    case articleAction.ARTICLE:
      return {
        ...action.payload
      }
    default:
      return articleState
  }

}

export function articleDeatilsReducer(articleDatilsState: Article[] = articleDatails,
  action: articleAction.AritcleTypeAction): any {
  switch (action.type) {

      case articleAction.ARTICLE_DETAILS:
        if (!articleDatilsState)
        return [{...action.payload}]
    else
      return [...articleDatilsState,{...action.payload}]
    default:
      return articleDatilsState
  }

}