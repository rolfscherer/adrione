import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, filter, withLatestFrom } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LayoutService } from '../../services/layout.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthGuard } from '../../auth/services/auth-guard';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'adri-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  @ViewChild('drawer', { static: false }) drawer!: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    router: Router,
    public layoutService: LayoutService,
    public authGuard: AuthGuard,
    public authService: AuthService
  ) {
    router.events
      .pipe(
        withLatestFrom(this.isHandset$),
        filter(([a, b]) => b && a instanceof NavigationEnd)
      )
      .subscribe(() => this.drawer?.close());
  }

  logout(): void {
    this.authService.logoff();
  }
}
