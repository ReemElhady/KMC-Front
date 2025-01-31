import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
  })
  export class DemoBookingService {
    private BaseUrl = environment.baseUrl;
    bookDemoPageApiEndpoint = 'api/home/book-demo-page'
    apiEndpoint = 'api/home/book-demo'
  
    constructor(private httpService: HttpService) {}
  
    bookDemo(data: any): Observable<any> {
      return this.httpService.postReq(this.apiEndpoint, data);
    }


    getBookDemoPageContent(): Observable<any> {
      return this.httpService.getReq(this.bookDemoPageApiEndpoint);
    }
    
  }