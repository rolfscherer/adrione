import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, filter, withLatestFrom } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LayoutService } from '../../services/layout.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Alert, AlertType } from '../../../shared/alert/alert.model';
import { AlertService } from '../../../shared/alert/alert.service';

@Component({
  selector: 'adri-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  @ViewChild('drawer', { static: false }) drawer!: MatSidenav;

  id = 1;

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
    public alertService: AlertService
  ) {
    router.events
      .pipe(
        withLatestFrom(this.isHandset$),
        filter(([a, b]) => b && a instanceof NavigationEnd)
      )
      .subscribe(() => this.drawer?.close());
  }

  show(): void {
    const options = {
      id: 'id' + ++this.id,
      autoClose: true,
      keepAfterRouteChange: false,
      type: AlertType.Info,
      title: 'Info',
      message: 'Das st eine Meldung'
    };

    this.alertService.alert(new Alert(options));
  }
}
