import { Component, Input, OnInit } from '@angular/core';
import { imgUrl } from 'src/app/@shared/http/http.service';
@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss'],
})
export class ArticleItemComponent implements OnInit {
  @Input('article') article!: any;
  @Input() isMobile: boolean = false;
  imgUrl = imgUrl;

  constructor() {}

  ngOnInit(): void {
  }

}

