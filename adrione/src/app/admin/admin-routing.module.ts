import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/auth/services/auth-guard';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',
        canActivate: [AuthGuard],
        component: UserComponent
      },
      { path: '', redirectTo: 'user', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
