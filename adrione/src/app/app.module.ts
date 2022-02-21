import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { httpInterceptorProviders } from './intercepter';
import { APP_BASE_HREF } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule
  ],

  providers: [
    { provide: APP_BASE_HREF, useValue: '/static' },
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
