import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, Router , ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot  } from '@angular/router';
import { AccountTypeConstant, ActionConstant } from '../_constants';
import { AlertifyService } from '../_service/alertify.service';
import { AuthenticationService } from '../_service/authentication.service';
import { navItems, navItemsAccessControl, navItemsCheckIn, navItemsCheckOut, navItemsManager, navItemsUser } from 'src/app/_nav';
@Injectable({
  providedIn: 'root'
})
export class AuthLocalGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.loggedIn()) {
      if (this.checkRole(route) === false) {
        this.authService.logOut();
        this.router.navigate(['login']);
        this.alertify.error("Access-denied", true);
        return false;
      }
      return true;
    }
    this.router.navigate(['login'], { queryParams: { uri: state.url }, replaceUrl: true });
    return false;
  }
  checkRole(route: ActivatedRouteSnapshot): boolean {
    let navs = [];
    const accountType = JSON.parse(localStorage.getItem('user'))?.accountType || '';
    if (accountType == AccountTypeConstant.MANAGER) {
      navs = navItemsManager;
    } else if (accountType == AccountTypeConstant.USER) {
      navs = navItemsUser;
    } else if (accountType == AccountTypeConstant.SYSTEM) {
      navs = navItems;
    }else if (accountType == AccountTypeConstant.CHECK_IN) {
      navs = navItemsCheckIn;
    } else if (accountType == AccountTypeConstant.CHECK_OUT) {
      navs = navItemsCheckOut;
    }else if (accountType == AccountTypeConstant.ACCESS_CONTROL) {
      navs = navItemsAccessControl;
    }
    const uri = route.routeConfig.path;
    const permissions = navs.map(x => x.url);
    for (const url of permissions) {
      if (url.includes(uri)) {
        return true;
      }
    }
    return false;
    // const functionCode = route.data.functionCode;
    // if (functionCode) {
    //   const functions = JSON.parse(localStorage.getItem('functions'));
    //   const childrenTemp = functions.map(el => {
    //     return el?.childrens;
    //   }).filter(Boolean);
    //   const permissions = [].concat.apply([], childrenTemp).filter(x => x.functionCode === functionCode);
    //   for (const item of permissions) {
    //     if (functionCode.includes(item.functionCode) && item.code === ActionConstant.VIEW ) {
    //       return true;
    //     }
    //   }
    //   return false;
    // }
    //return true;

  }
}

