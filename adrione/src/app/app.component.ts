import { Component } from '@angular/core';
import { LayoutService } from './core/services/layout.service';

@Component({
  selector: 'adri-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // eslint-disable-next-line no-unused-vars
  constructor(private layoutService: LayoutService) {}

  public getTheme(): string {
    return this.layoutService.theme;
  }
}
