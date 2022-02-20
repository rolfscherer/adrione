import { AuthenticationRequest, AuthenticationResponse } from '../model/auth';
import { Observable, tap } from 'rxjs';
import { AuthGuard } from './auth-guard';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from './jwt-helper.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'api/v1/auth/login';
  private authToken = 'authenticationToken';
  private requestedUrl: string | null = null;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authGuard: AuthGuard,
    private jwtHelper: JwtHelperService
  ) {}

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.httpClient
      .post<AuthenticationResponse>(this.apiUrl, request)
      .pipe(
        tap((response) => {
          this.authGuard.setLoggedIn(
            request.username,
            true,
            this.jwtHelper.getRoles(response.token)
          );

          if (request.rememberMe) {
            localStorage.setItem(this.authToken, response.token);
          } else {
            sessionStorage.setItem(this.authToken, response.token);
          }

          if (this.requestedUrl != null) {
            this.router.navigate([this.requestedUrl]).then();
          }
        })
      );
  }

  getAuthorizationToken(): string | null {
    return (
      localStorage.getItem(this.authToken) ||
      sessionStorage.getItem(this.authToken)
    );
  }

  logoff(redirect: string = '/', requestedUrl: string | null = null): void {
    this.requestedUrl = requestedUrl;
    localStorage.removeItem(this.authToken);
    sessionStorage.removeItem(this.authToken);
    this.authGuard.setLoggedIn(null, false, []);
    this.router.navigate([redirect]).then();
  }
}
