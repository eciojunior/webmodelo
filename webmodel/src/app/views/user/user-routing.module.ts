import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDataComponent } from './userdata/userdata.component';
import { UserListComponent } from './userlist/userlist.component';
import { AuthGaurd } from '../../shared/services/auth.gaurd';
import { AdminGaurd } from '../../shared/services/admin.gaurd';

const routes: Routes = [
  {
    path: 'data',
    component: UserDataComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: 'list',
    component: UserListComponent,
    canActivate: [AdminGaurd]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
