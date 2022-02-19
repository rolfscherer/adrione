import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialFormModule } from '../material/material-form.module';
import { MaterialMinModule } from '../material/material-min.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialMinModule,
    MaterialFormModule
  ]
})
export class AuthModule {}
