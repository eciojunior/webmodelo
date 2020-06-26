import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';
import { HomeComponent } from './views/home/home.component';

const adminRoutes: Routes = [
    {
      path: '',
      component: HomeComponent
    },
    {
      path: 'sessions',
      loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule)
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
