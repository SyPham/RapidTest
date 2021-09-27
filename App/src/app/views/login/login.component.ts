import { navItemsAccessControl, navItemsCheckOut, navItemsCheckIn } from './../../_nav';
import { PermissionService } from 'src/app/_core/_service/permission.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertifyService } from '../../_core/_service/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserForLogin } from 'src/app/_core/_model/user';
import { environment } from 'src/environments/environment';
import { RoleService } from 'src/app/_core/_service/role.service';
import { IRole, IUserRole } from 'src/app/_core/_model/role';
import { IBuilding } from 'src/app/_core/_model/building';
import { AuthenticationService } from 'src/app/_core/_service/authentication.service';
import { Subscription } from 'rxjs';
import { FunctionSystem } from 'src/app/_core/_model/application-user';
import { NgxSpinnerService } from 'ngx-spinner';
import { Authv2Service } from 'src/app/_core/_service/authv2.service';
import { AccountTypeConstant } from 'src/app/_core/_constants';
import { navItems, navItemsManager, navItemsUser } from 'src/app/_nav';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  busy = false;
  username = '';
  password = '';
  loginError = false;
  private subscription: Subscription;

  user: UserForLogin = {
    username: '',
    password: '',
    systemCode: environment.systemCode
  };
  uri: any;
  level: number;

  remember = false;
  functions: FunctionSystem[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: Authv2Service,
    private permisisonService: PermissionService,
    private roleService: RoleService,
    private spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private permissionService: PermissionService,
    private alertifyService: AlertifyService
  ) {
    if (this.cookieService.get('remember') !== undefined) {
      if (this.cookieService.get('remember') === 'Yes') {
        this.user = {
          username: this.cookieService.get('username'),
          password: this.cookieService.get('password'),
          systemCode: environment.systemCode
        };
        this.username = this.cookieService.get('username');
        this.password = this.cookieService.get('password');
        this.remember = true;
        this.login();
      }
    }
    const accountType = JSON.parse(localStorage.getItem('user'))?.accountType || '';
    let backUrl = '/login';
    if (accountType == AccountTypeConstant.MANAGER) {
      backUrl = '/staff-info';
    } else if (accountType == AccountTypeConstant.USER) {
      backUrl = '/access-control';
    } else if (accountType == AccountTypeConstant.SYSTEM) {
      backUrl = '/account';
    }
    this.uri = this.route.snapshot.queryParams.uri || backUrl;
  }
  role: number;
  ngOnInit(): void {
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (accessToken && refreshToken && this.route.routeConfig.path === 'login') {
      const accountType = JSON.parse(localStorage.getItem('user'))?.accountType || '';
      let backUrl = '/login';
      if (accountType == AccountTypeConstant.MANAGER) {
        backUrl = '/staff-info';
      } else if (accountType == AccountTypeConstant.USER) {
        backUrl = '/access-control';
      } else if (accountType == AccountTypeConstant.SYSTEM) {
        backUrl = '/account';
      }
      const uri = decodeURI(this.uri) || backUrl;
      this.router.navigate([uri]);
    }
  }
  onChangeRemember(args) {
    this.remember = args.target.checked;
  }
  authentication() {
    return this.authService
      .login(this.username, this.password).toPromise();
  }
  async login() {
    if (!this.username || !this.password) {
      return;
    }
    this.spinner.show();
    this.busy = true;
    try {
      const data = await this.authentication();
      // console.log('End authenication');

      // this.role = JSON.parse(localStorage.getItem('user')).user.role;
      // const userId = JSON.parse(localStorage.getItem('user')).user.id;

      // console.log('end getRoleByUserID');

      // console.log('Begin getMenu', userId);

      // const menus = await this.permissionService.getMenuByLangID(userId, 'vi').toPromise();
      // console.log('end nav', menus);

      const currentLang = localStorage.getItem('lang');
      if (currentLang) {
        localStorage.setItem('lang', currentLang);
      } else {
        localStorage.setItem('lang', 'en');
      }

      if (this.remember) {
        this.cookieService.set('remember', 'Yes');
        this.cookieService.set('username', this.user.username);
        this.cookieService.set('password', this.user.password);
        this.cookieService.set('systemCode', this.user.systemCode.toString());
      } else {
        this.cookieService.set('remember', 'No');
        this.cookieService.set('username', '');
        this.cookieService.set('password', '');
        this.cookieService.set('systemCode', '');
      }
      // setTimeout(() => {
      //   const check = this.checkRole();
      //   if (check) {
      //     const uri = decodeURI(this.uri);
      //     this.router.navigate([uri]);
      //   } else {
      //     this.router.navigate(['/system/account']);
      //   }

      // });
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      const uri = decodeURI(this.uri);

      const check = this.checkLocalRole();
      if (check ) {
        const uri = decodeURI(this.uri);
        this.router.navigate([uri]);
      } else {
        const accountType = JSON.parse(localStorage.getItem('user'))?.accountType || '';
        let backUrl = '/login';
        if (accountType == AccountTypeConstant.MANAGER) {
          backUrl = '/staff-info';
        } else if (accountType == AccountTypeConstant.USER) {
          backUrl = '/access-control';
        } else if (accountType == AccountTypeConstant.SYSTEM) {
          backUrl = '/account';
        } else if (accountType == AccountTypeConstant.CHECK_IN) {
          backUrl= '/check-in';
        } else if (accountType == AccountTypeConstant.CHECK_OUT) {
          backUrl = '/check-out';
        } else if (accountType == AccountTypeConstant.ACCESS_CONTROL) {
          backUrl = '/access-control';
        }
        this.router.navigate([backUrl]);
      }

      this.alertifyService.success('Login Success!!');
      this.busy = false;
      this.spinner.hide();


    } catch (error) {
      this.spinner.hide();
      this.busy = true;
      this.loginError = true;
    }
  }

  getMenu(userid) {
    this.permissionService.getMenuByUserPermission(userid).toPromise();
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  checkRole(): boolean {
    const uri = decodeURI(this.uri);
    const permissions = this.functions.map(x => x.url);
    for (const url of permissions) {
      if (uri.includes(url)) {
        return true;
      }
    }
    return false;
  }
  checkLocalRole(): boolean {
    let navs = [];
    const accountType = JSON.parse(localStorage.getItem('user'))?.accountType || '';
    if (accountType == AccountTypeConstant.MANAGER) {
      navs = navItemsManager;
    } else if (accountType == AccountTypeConstant.USER) {
      navs = navItemsUser;
    } else if (accountType == AccountTypeConstant.SYSTEM) {
      navs = navItems;
    } else if (accountType == AccountTypeConstant.CHECK_IN) {
      navs = navItemsCheckIn;
    } else if (accountType == AccountTypeConstant.CHECK_OUT) {
      navs = navItemsCheckOut;
    }else if (accountType == AccountTypeConstant.ACCESS_CONTROL) {
      navs = navItemsAccessControl;
    }
    const uri = decodeURI(this.uri);
    if (uri == '/login') {
      return false;
    }
    const permissions = navs.map(x => x.url);
    for (const url of permissions) {
      if (uri.includes(url)) {
        return true;
      }
    }
    return false;
  }
}
