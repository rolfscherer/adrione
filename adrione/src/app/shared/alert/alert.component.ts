import { Alert, AlertType } from './alert.model';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { AlertService } from './alert.service';

@Component({
  selector: 'adri-alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.scss'],
  animations: [
    trigger('inOut', [
      transition('void => *', [
        style({ opacity: 0 }), // initial styles
        animate(
          '400ms',
          style({ opacity: 1 }) // final style after the transition has finished
        )
      ]),
      transition('* => void', [
        animate(
          '400ms',
          style({ opacity: 0 }) // we asume the initial style will be always opacity: 1
        )
      ])
    ])
  ]
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() fade = true;

  public alerts$: Observable<Alert[]> = of([]);
  subscription = new Subscription();

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit(): void {
    this.alerts$ = this.alertService.onAlert();
    this.subscription.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.alertService.removeAllAlertsWithoutKeepAfterRouteChangeFlag();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeAlert(alert: Alert): void {
    this.alertService.removeAlert(alert);
  }

  cssClasses(alert: Alert) {
    if (!alert) return;

    const classes = ['alert'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert-success',
      [AlertType.Error]: 'alert-danger',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning'
    };

    classes.push(alertTypeClass[alert.type]);

    return classes.join(' ');
  }
}
