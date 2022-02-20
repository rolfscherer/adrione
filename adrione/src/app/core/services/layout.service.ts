import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private darkMode = true;
  private _sidenavIsPinned = true;
  private _name = 'adriOne';
  private _theme = 'green-dark'; // indigo-light, teal-light, blue-dark, green-dark

  constructor() {}

  get sidenavIsPinned(): boolean {
    return this._sidenavIsPinned;
  }

  set sidenavIsPinned(value: boolean) {
    this._sidenavIsPinned = value;
  }

  get theme(): string {
    return this._theme;
  }

  set theme(value: string) {
    this._theme = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  setDarkMode(): void {
    this._theme = 'green-dark';
    this.darkMode = true;
  }

  setLightMode(): void {
    this._theme = 'teal-light';
    this.darkMode = false;
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }
}
