import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthSigninComponent } from './auth-signin/auth-signin.component';
import { AuthResetPasswordComponent } from './auth-reset-password/auth-reset-password.component';
import { AuthChangePasswordComponent } from './auth-change-password/auth-change-password.component';
import { AuthForgotPasswordComponent } from './auth-forgot-password/auth-forgot-password.component';
import { AuthSignupComponent } from './auth-signup/auth-signup.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AuthSigninComponent
      },
      {
        path: 'signup',
        component: AuthSignupComponent
      },
      {
        path: 'reset-password/:email_code',
        component: AuthResetPasswordComponent
      },
      {
        path: 'change-password',
        component: AuthChangePasswordComponent
      },
      {
        path: 'forgot-password',
        component: AuthForgotPasswordComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
