import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AlertService } from '../shared/alert/alert.service';
import { Injectable } from '@angular/core';
import { ServerError } from '../shared/model/server-error-message';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private autToken = 'authenticationToken';
  constructor(
    private alertService: AlertService,
    private authService: AuthService
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
            this.authService.onLogoff();
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
