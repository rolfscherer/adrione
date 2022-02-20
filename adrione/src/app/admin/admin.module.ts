import { CommonModule } from '@angular/common';
import { MaterialFormModule } from '../material/material-form.module';
import { MaterialMinModule } from '../material/material-min.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, MaterialMinModule, MaterialFormModule]
})
export class AdminModule {}
