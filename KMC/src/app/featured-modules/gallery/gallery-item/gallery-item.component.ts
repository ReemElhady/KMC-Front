import { Component, Input, OnInit  } from '@angular/core';
import { imgUrl } from 'src/app/@shared/http/http.service';

@Component({
  selector: 'app-gallery-item',
  templateUrl: './gallery-item.component.html',
  styleUrls: ['./gallery-item.component.scss'],
})
export class GalleryItemComponent implements OnInit{
  @Input('galleryitem') galleryitem!: any;
  @Input() isMobile: boolean = false;
  imgUrl = imgUrl;

  constructor() {}

  ngOnInit(): void {
  }
}
