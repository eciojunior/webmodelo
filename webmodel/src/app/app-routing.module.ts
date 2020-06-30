import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';
import { HomeComponent } from './views/home/home.component';
import { AuthGaurd } from './shared/services/auth.gaurd';
import { AdminGaurd } from './shared/services/admin.gaurd';
const adminRoutes: Routes = [
    {
      path: '',
      component: HomeComponent,
    },
    {
      path: 'partner',
      loadChildren: () => import('./views/partners/partners.module').then(m => m.PartnersModule)
    },
    {
      path: 'user',
      loadChildren: () => import('./views/user/user.module').then(m => m.UserModule),
      canActivate: [AuthGaurd]
    }
  ];

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutSidebarLargeComponent,
    children: adminRoutes
  },
  {
    path: '**',
    redirectTo: 'others/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
