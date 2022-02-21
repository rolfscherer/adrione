import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { INIT_SESSION_STATE, SessionStatus } from '../model/session-status';
import { Injectable } from '@angular/core';

export declare interface OnLogoff {
  onLogoff(): void;
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
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

  get username(): string | null {
    return this.sessionStatus$.getValue().username;
  }

  addlogoffHandler(source: OnLogoff): void {
    this.logoffHandler.push(source);
  }

  private logoff(): void {
    this.logoffHandler.forEach((h) => h.onLogoff());
  }

  setLoggedIn(
    username: string | null,
    loggedIn: boolean,
    roles: string[]
  ): void {
    let sessionStatus = this.sessionStatus$.getValue();
    sessionStatus.username = username;
    sessionStatus.loggedIn = loggedIn;
    sessionStatus.roles = [...roles];
    if (!loggedIn) {
      this.logoff();
    }
  }

  setRights(roles: string[]): void {
    let sessionStatus = this.sessionStatus$.getValue();
    sessionStatus.roles = [...roles];
  }

  private hasAnyAuthorities(authorities: string[] | string): boolean {
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }

    return authorities.some((a) =>
      this.sessionStatus$.getValue().roles.includes(a)
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.sessionStatus$.getValue().loggedIn) {
      return of(false);
    }

    const authorities = route.data['authorities'];

    if (
      !authorities ||
      authorities.length === 0 ||
      this.hasAnyAuthorities(authorities)
    ) {
      return of(true);
    }

    return of(false);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
