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
  private apiUrl = 'api/v1/auth';
  private authToken = 'authenticationToken';
  private authUser = 'authenticationUser';
  private requestedUrl: string | null = null;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authGuard: AuthGuard,
    private jwtHelper: JwtHelperService
  ) {
    const token = this.getAuthorizationToken();
    if (token && !jwtHelper.isTokenExpired(token, 5)) {
      this.authGuard.setLoggedIn(
        this.getAuthorizationUser(),
        true,
        this.jwtHelper.getRoles(token)
      );
    }
  }

  processAuthResponse(
    response: AuthenticationResponse,
    username: string,
    rememberMe: boolean | undefined
  ): void {
    this.authGuard.setLoggedIn(
      username,
      true,
      this.jwtHelper.getRoles(response.token)
    );

    if (rememberMe) {
      localStorage.setItem(this.authToken, response.token);
      localStorage.setItem(this.authUser, username);
    } else {
      sessionStorage.setItem(this.authToken, response.token);
      sessionStorage.setItem(this.authUser, username);
    }

    if (this.requestedUrl != null) {
      this.router.navigate([this.requestedUrl]).then();
    }
  }

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.httpClient
      .post<AuthenticationResponse>(this.apiUrl + '/login', request)
      .pipe(
        tap((response) =>
          this.processAuthResponse(
            response,
            request.username,
            request.rememberMe
          )
        )
      );
  }

  refreshToken(): Observable<AuthenticationResponse> | null {
    const token = this.getAuthorizationToken();
    if (!token || this.jwtHelper.isTokenExpired(token, 5)) {
      return null;
    }

    const username = this.getAuthorizationUser();
    const rememberMe = localStorage.getItem(this.authToken) != null;

    if (username) {
      return this.httpClient.get<AuthenticationResponse>(this.apiUrl).pipe(
        tap((response) => {
          this.processAuthResponse(response, username, rememberMe);
        })
      );
    }
    return null;
  }

  getAuthorizationToken(): string | null {
    const token =
      localStorage.getItem(this.authToken) ||
      sessionStorage.getItem(this.authToken);

    if (this.jwtHelper.isTokenExpired(token, 5)) {
      return null;
    }

    return token;
  }

  getAuthorizationUser(): string | null {
    return (
      localStorage.getItem(this.authUser) ||
      sessionStorage.getItem(this.authUser)
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
