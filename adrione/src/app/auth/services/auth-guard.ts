import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { INIT_SESSION_STATE, SessionStatus } from '../model/session-status';
import { Injectable } from '@angular/core';

export declare interface OnLogoff {
  onLogoff(): void;
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private sessionStatus$: BehaviorSubject<SessionStatus>;
  private logoffHandler: OnLogoff[] = [];

  constructor() {
    this.sessionStatus$ = new BehaviorSubject<SessionStatus>(
      INIT_SESSION_STATE
    );
  }

  get isLoggedIn$(): Observable<boolean> {
    return of(this.sessionStatus$.getValue().loggedIn);
  }

  addlogoffHandler(source: OnLogoff): void {
    this.logoffHandler.push(source);
  }

  logoff(): void {
    this.logoffHandler.forEach((h) => h.onLogoff());
  }

  setLoggedIn(value: boolean, roles: string[]): void {
    let sessionStatus = this.sessionStatus$.getValue();
    sessionStatus.loggedIn = value;
    sessionStatus.roles = roles;
  }

  setRights(roles: string[]): void {
    let sessionStatus = this.sessionStatus$.getValue();
    sessionStatus.roles = roles;
  }

  canActivate(_route: ActivatedRouteSnapshot): Observable<boolean> {
    return of(this.sessionStatus$.getValue().loggedIn);
  }
}
