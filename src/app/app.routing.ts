import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuardService } from './shared/services/auth.guard.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'crm/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [{
      path: '',
      loadChildren: './authentication/authentication.module#AuthenticationModule'
    }]
  },
  {
    path: 'crm',
    // canActivateChild
  // canLoad,

    canActivate: [AuthGuardService],
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    }]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: false,
    
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
