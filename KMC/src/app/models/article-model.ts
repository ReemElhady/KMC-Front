export interface Articles{
    count:number  
    next: null
    previous:null
    results: Article[]
}
export interface Article {
  article_department: string
  article_image: string
  article_text: string
  article_title: string
  article_writer: string
  created_at: string
  id: string
  pdf_articale: string
  isArchived: false
}
