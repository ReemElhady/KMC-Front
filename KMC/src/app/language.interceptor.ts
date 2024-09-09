import { Injectable } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http'

import { empty, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';// import { AuthService } from './auth/auth.service';
import { HttpService } from './@shared/http/http.service';
import { Router } from '@angular/router';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  langReq: any
  constructor(
    private cs: CookieService,
    private httpService: HttpService,
    private route: Router
  ) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    let language = this.cs.get('language')
    if (!language) {
      language = 'en'
    }
    const langReq = request.clone({
      headers: new HttpHeaders({
        Authorization: this.cs.get('token') ? `Bearer ${this.cs.get('token')}` : '',
        'Accept-Language': language,
      }),
    })

    return next.handle(langReq).pipe(
      catchError(error => {
        if (error.url.includes('/token/refresh')) {

          this.httpService.logoutSubj.next(true);
          this.route.navigate(['/auth', 'login'])
          return throwError(error);
        }
        if (error.status === 401 && error.error.code === 'token_not_valid') {
          return this.reAuthenticate(error, langReq).pipe(
            switchMap(() => {
              const langReq = request.clone({
                headers: new HttpHeaders({
                  Authorization: this.cs.get('token') ? `Bearer ${this.cs.get('token')}` : '',
                  'Accept-Language': language,
                }),
              })
              return next.handle(langReq)
            })
          )
        }
        return throwError(error);

      })
    );
  }
  reAuthenticate(error: any, langReq: any): Observable<any> {
    const refresh = this.cs.get('refresh')
    if (this.cs.get('token') !== langReq.headers.headers.get('authorization')[0].split(' ')[1]) {
      return empty();
    }
    return this.httpService.postReq('api/token/refresh/', { refresh }).pipe(tap(res => {
      this.cs.set('token', res.access, { path: '/' })
    }))
  }
}
