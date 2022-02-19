import { AlertComponent } from './alert/alert.component';
import { CommonModule } from '@angular/common';
import { MaterialMinModule } from '../material/material-min.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AlertComponent],
  exports: [AlertComponent],
  imports: [CommonModule, MaterialMinModule]
})
export class SharedModule {}
