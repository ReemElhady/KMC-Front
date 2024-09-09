import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private BaseUrl = environment.baseUrl;
  phone = new Subject<string>();
  password = new Subject<string>();
  isAuthenticated: boolean = false;
  userName = new BehaviorSubject<string>('');
  errorString: any;
  logoutSubj = new Subject<any>();

  constructor(
    private http: HttpClient,
    private cs: CookieService,
    private router: Router
  ) {}
  // get method
  getReq(url: string): Observable<any> {
    return this.http.get<any>(this.BaseUrl + url);
  }
  // Post method
  postReq(url: string, body: {}): Observable<any> {
    return this.http.post<any>(this.BaseUrl + url, body);
  }

  // Put method
  putReq(url: string, body: {}): Observable<any> {
    return this.http.put<any>(this.BaseUrl + url, body);
  }
  //delete method
  deleteReq(url: string): Observable<any> {
    return this.http.delete<any>(this.BaseUrl + url);
  }
  //get one method
  getOneReq(url: string): Observable<any> {
    return this.http.get<any>(this.BaseUrl + url);
  }
  // patch method
  patchReq(url: string, body: {}): Observable<any> {
    return this.http.patch<any>(this.BaseUrl + url, body);
  }
  handleHttpError(error: any): string {
    let errorString = '';
    if (!error.ok) {
      if (error.status === 400) {
        errorString = 'User with this phone already exists';
      } else if (error.status === 401) {
        errorString = 'Mobile Or password is incorrect';
        // this.router.navigate(['/auth/login']);
      } else if (error.status === 404) {
        // this.router.navigate(['/errors/404']);
      } else if (error.status === 406) {
        errorString = 'Code Expired or not correct';
      } else if (error.status === 500) {
        // this.router.navigate(['/errors/500']);
      }
    }
    return errorString;
  }
  handleAdressesError(error: any) {
    if (!error.ok && error.status === 400) {
      this.errorString =
        this.cs.get('language') == 'ar'
          ? 'هذه المدينه ليست موجودة في الدولة'
          : 'city is not a valid option';

      //  = 'city is not a valid option'
      return this.errorString;
    }
  }
  handleHttpPagesError(error: any): void {
    if (!error.ok) {
      if (error.status === 400) {
      } else if (error.status === 401) {
        this.router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        this.router.navigate(['/errors/403']);
      } else if (error.status === 404) {
        this.router.navigate(['/errors/404']);
      } else if (error.status === 500) {
        this.router.navigate(['/errors/500']);
      }
    }
  }
}
// export const imgUrl = 'https://staging.kandilmedical.com';
// export const imgUrl = 'http://staging.freaksrepublic.com:8012';
export const imgUrl = environment.baseUrl.slice(0, -1);
