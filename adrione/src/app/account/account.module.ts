import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MaterialMinModule } from '../material/material-min.module';
import { MaterialFormModule } from '../material/material-form.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialMinModule,
    MaterialFormModule
  ]
})
export class AccountModule {}
