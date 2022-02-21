import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../model/profile';
import { AuthGuard } from '../../core/auth/services/auth-guard';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private url = '/api/v1/user/';

  constructor(private httpClient: HttpClient, private authGuard: AuthGuard) {}

  getProfile(): Observable<Profile> {
    return this.httpClient.get<Profile>(this.url + this.authGuard.username);
  }
}
