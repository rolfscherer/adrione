import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { MaterialFormModule } from '../material/material-form.module';
import { MaterialMinModule } from '../material/material-min.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MaterialMinModule,
    MaterialFormModule
  ]
})
export class LoginModule {}
