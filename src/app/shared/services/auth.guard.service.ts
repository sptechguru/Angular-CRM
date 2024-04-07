import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageAccessorService } from './localstorage-accessor.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private localStorage: StorageAccessorService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.localStorage.fetchToken();
    // // console.log('Current URL : ', state.url);//'candidates'
     const role = this.localStorage.fetchUserDetailsByKey('user_role').role_name;
    
     
    if (token && role !== 'reseller') {
      if (state.url == '/auth/login') {
        this.router.navigate(['/crm/dashboard']);
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }
}


@Injectable()
export class PermissionGuardService implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private localStorage: StorageAccessorService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   const role = this.localStorage.fetchRole;
    if(role === 'admin') return true;
    if(this.localStorage.fetchRole.includes(route.data.role)) return true;
    else{
       this.router.navigate(['/crm/dashboard'], { queryParams: { returnUrl: state.url }});
        return false;
    }
  }
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }
}

@Injectable()
export class CrmUserGuardService implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private localStorage: StorageAccessorService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   const role = this.localStorage.crmUserPermissions;
    if(role) return true;
    else{
       this.router.navigate(['/crm/dashboard'], { queryParams: { returnUrl: state.url }});
        return false;
    }
  }
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }
}



