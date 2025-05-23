import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdService {
  private BaseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAds(): Observable<string[]> {
    return this.http.get<string[]>(this.BaseUrl + 'api/home/ad/');
  }
}
