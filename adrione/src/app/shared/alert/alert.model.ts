export interface AlertConfig {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  code: string | undefined;
  path: string | undefined;
  autoClose: boolean;
  autoCloseTimeout: number;
  keepAfterRouteChange: boolean;
  fade: boolean;
  fadeTimeout: number;
}

export class Alert implements AlertConfig {
  id: string = '0';
  type: AlertType = AlertType.Info;
  title: string = '';
  message: string = '';
  code: string | undefined;
  path: string | undefined;
  autoClose: boolean = true;
  autoCloseTimeout: number = 3000;
  keepAfterRouteChange: boolean = false;
  fade: boolean = true;
  fadeTimeout = 400;

  constructor(init?: Partial<Alert>) {
    Object.assign(this, init);
  }
}

export enum AlertType {
  Info,
  Success,
  Warning,
  Error
}
