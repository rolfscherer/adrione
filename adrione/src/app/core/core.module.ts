import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { MaterialMinModule } from '../material/material-min.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [MainLayoutComponent, HomeComponent],
  imports: [
    CommonModule,
    LayoutModule,
    MaterialMinModule,
    SharedModule,
    RouterModule.forChild([])
  ]
})
export class CoreModule {}
