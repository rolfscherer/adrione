import { AuthenticationRequest, AuthenticationResponse } from '../model/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _apiUrl = 'api/auth/login';

  constructor(private httpClient: HttpClient) {}

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.httpClient.post<AuthenticationResponse>(this._apiUrl, request);
  }
}
