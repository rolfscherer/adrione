import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../model/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private url = '/api/v1/user/';

  constructor(private httpClient: HttpClient) {}

  getProfile(): Observable<Profile> {
    return this.httpClient.get<Profile>(this.url);
  }
}
