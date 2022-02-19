import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // set content type if missing
    if (!req.headers.has('Content-Type')) {
      req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json')
      });
    }
    if (
      !req ||
      !req.url ||
      (/^http/.test(req.url) &&
        !(
          environment.SERVER_API_URL &&
          req.url.startsWith(environment.SERVER_API_URL)
        ))
    ) {
      return next.handle(req);
    }

    const authToken = this.authService.getAuthorizationToken();

    if (authToken) {
      req = req.clone({ setHeaders: { Authorization: 'Bearer ' + authToken } });
    }
    return next.handle(req);
  }
}
