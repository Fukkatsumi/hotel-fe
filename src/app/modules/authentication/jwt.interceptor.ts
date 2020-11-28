import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {Observable, throwError} from 'rxjs';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class JWTInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.token();
    if (req.url.includes('authenticate')) {
      return next.handle(req);
    }
    if (isNotNullOrUndefined(token)) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req)
      .pipe(
        catchError(
          (error: HttpErrorResponse) => {
            if (error.status === 403) {
              this.authService.logout();
              alert('Your token is expired, re-login please');
            }
            return throwError(error);
          }
        )
      );
  }

}
