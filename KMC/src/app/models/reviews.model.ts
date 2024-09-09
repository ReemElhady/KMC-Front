export interface Reviews {
  count: number
  next: number
  previous: number
  results: ReviewContent[]
}


export interface ReviewContent {
  content: string;
  id: number;
  name: string
  product: string
  rate: number;
  user: number;
}
