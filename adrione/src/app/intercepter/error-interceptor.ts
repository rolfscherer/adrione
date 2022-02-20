import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AlertService } from '../shared/alert/alert.service';
import { AuthService } from '../core/auth/services/auth.service';
import { Injectable } from '@angular/core';
import { ServerError } from '../shared/model/server-error-message';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          // client side error
          errorMsg = `Error: ${error.error.message}`;
        } else {
          // server side error
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;

          if (error.status === 401) {
            if (this.router.url != '/login') {
              this.authService.logoff('/login', this.router.url);
            } else {
              this.authService.logoff('/login', null);
            }
          }

          if (error.error) {
            const msg = error.error as ServerError;
            this.alertService.error(msg);
          }
        }
        console.log(errorMsg);
        return throwError(() => errorMsg);
      })
    );
  }
}
