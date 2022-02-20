import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/auth/services/auth-guard';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profile',
        canActivate: [AuthGuard],
        component: ProfileComponent
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
