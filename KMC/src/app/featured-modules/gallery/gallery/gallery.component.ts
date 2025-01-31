import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService, imgUrl } from 'src/app/@shared/http/http.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  images: any[] = [];
  imgUrl = imgUrl;
  isMobile: boolean = false;
  isLoading: boolean = false;

  constructor( 
    private route: ActivatedRoute,
    private http: HttpService) {
      if (window.innerWidth < 767) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    }

  ngOnInit(): void {
    this.isLoading = false;
    this.http.getReq('api/home/gallery/').subscribe((data: any) => {
      this.images = data;
      if (!this.images) {
        this.isLoading = true;
      }
      console.log("Data",this.images)
    });
  }
}
