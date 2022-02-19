import { Alert, AlertType } from './alert.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private subject = new Subject<Alert[]>();

  subscription = new Subscription();
  alerts: Alert[] = [];

  constructor() {}

  // enable subscribing to alerts observable
  onAlert(): Observable<Alert[]> {
    return this.subject.asObservable();
  }

  // convenience methods
  success(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Success, message }));
  }

  error(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Error, message }));
  }

  info(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Info, message }));
  }

  warn(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Warning, message }));
  }

  alert(alert: Alert): void {
    if (alert.autoClose) {
      setTimeout(() => this.removeAlert(alert), alert.autoCloseTimeout);
    }

    this.alerts.push(alert);
    this.subject.next(this.alerts);
  }

  removeAlert(alert: Alert): void {
    if (!this.alerts.includes(alert)) return;

    // Alert with fade out
    if (alert.fade) {
      setTimeout(() => {
        this.alerts = this.alerts.filter((a) => a !== alert);
        this.subject.next(this.alerts);
      }, alert.fadeTimeout);
    } else {
      this.alerts = this.alerts.filter((a) => a !== alert);
      this.subject.next(this.alerts);
    }
  }

  removeAllAlertsWithoutKeepAfterRouteChangeFlag(): void {
    this.alerts = this.alerts.filter((a) => !a.keepAfterRouteChange);
    this.subject.next(this.alerts);
  }

  clearAll(): void {
    this.alerts = [];
    this.subject.next(this.alerts);
  }
}
