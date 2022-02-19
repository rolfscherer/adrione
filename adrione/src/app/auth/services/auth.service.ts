import { AuthenticationRequest, AuthenticationResponse } from '../model/auth';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from './auth-guard';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _apiUrl = 'api/auth/login';
  private authToken = 'authenticationToken';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authGuard: AuthGuard
  ) {}

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.httpClient
      .post<AuthenticationResponse>(this._apiUrl, request)
      .pipe(
        tap((response) => {
          if (request.rememberMe) {
            localStorage.setItem(
              this.authToken,
              JSON.stringify(response.token)
            );
          } else {
            sessionStorage.setItem(
              this.authToken,
              JSON.stringify(response.token)
            );
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

  onLogoff(): void {
    localStorage.removeItem(this.authToken);
    sessionStorage.removeItem(this.authToken);
    this.authGuard.setLoggedIn(false, []);
    this.router.navigate(['/']);
  }
}
