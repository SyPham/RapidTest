import { Subscription } from 'rxjs';
import { navItemsCheckIn, navItemsCheckOut } from './../../_nav';
import { AccountTypeConstant } from './../../_core/_constants/system.constant';

import { AfterViewInit, Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../_core/_service/auth.service';
import { AlertifyService } from '../../_core/_service/alertify.service';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/_core/_service/header.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CalendarsService } from 'src/app/_core/_service/calendars.service';
import * as moment from 'moment';
import { Nav } from 'src/app/_core/_model/nav';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { RoleService } from 'src/app/_core/_service/role.service';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from 'src/app/_core/_service/data.service';
import { PermissionService } from 'src/app/_core/_service/permission.service';
import { AuthenticationService } from 'src/app/_core/_service/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { VersionService } from 'src/app/_core/_service/version.service';
declare var require: any;
import * as signalr from '../../../assets/js/ec-client.js';
import { HubConnectionState } from '@microsoft/signalr';
import { navItems, navItemsAccessControl, navItemsManager, navItemsUser } from 'src/app/_nav';
import { Authv2Service } from 'src/app/_core/_service/authv2.service';
import { PingService } from 'src/app/_core/_service/ping.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['default-layout.component.css']
})
export class DefaultLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  public sidebarMinimized = false;
  public navItems = navItems;
  public navAdmin: any;
  public navClient: any;
  navEc: any;
  public total: number;
  public totalCount: number;
  public page: number;
  public pageSize: number;
  public currentUser: string;
  public currentTime: any;
  userid: number;
  level: number;
  roleName: string;
  role: any;
  avatar: any;
  vi: any;
  en: any;
  langsData: object[];
  public fields = { text: 'name', value: 'id' };
  public value: string;
  zh: any;
  menus: any;
  modalReference: any;
  accountType: any;
  ping: number;
  @HostListener('window:scroll', ['$event'])
  onScroll(e) {
    console.log('window', e);
  }
  online: number;
  userID: number;
  userName: any;
  data: [] = [];
  firstItem: any;
  sidebarToggler: any;
  asideMenuToggler: any;
  mobileSidebarToggler: any;
  subscription: Subscription = new Subscription();
  constructor(
    private authService: AuthService,
    private authenticationService: Authv2Service,
    private roleService: RoleService,
    private alertify: AlertifyService,
    private permissionService: PermissionService,
    private headerService: HeaderService,
    private calendarsService: CalendarsService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    public translate: TranslateService,
    private pingService:PingService


  ) {
    this.vi = require('../../../assets/ej2-lang/vi.json');
    this.en = require('../../../assets/ej2-lang/en.json');
    this.role = JSON.parse(localStorage.getItem('level'));
    this.value = localStorage.getItem('lang');
    const user = JSON.parse(localStorage.getItem("user"));
    this.userName = user?.fullName;
    this.userID = user?.id;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  onActivate(event) {
    window.scroll(0,0);
  }
  ngOnInit(): void {
   this.subscription= this.pingService.pingStream.subscribe(ping => {
      this.ping = ping;
    });
    this.sidebarToggler = 'lg';
    this.asideMenuToggler = 'lg';
    this.mobileSidebarToggler = true;
    if (signalr.CONNECTION_HUB.state === HubConnectionState.Connected) {
      signalr.CONNECTION_HUB
        .invoke('CheckOnline', this.userID, this.userName)
        .catch(error => {
          console.log(`CheckOnline error: ${error}`);
        }
        );
      signalr.CONNECTION_HUB.on('Online', (users) => {
        this.online = users;
      });

      signalr.CONNECTION_HUB.on('UserOnline', (userNames: any) => {
        const userNameList = JSON.stringify(userNames);
        localStorage.setItem('userOnline', userNameList);
      });
    }
    // this.versionService.getAllVersion().subscribe((item: any) => {
    //   this.data = item;
    //   this.firstItem = item[0] || {};
    // });

    this.langsData = [{ id: 'vi', name: 'VI' }, { id: 'en', name: 'EN' }];
    this.navAdmin = new Nav().getNavAdmin();
    this.navClient = new Nav().getNavClient();
    this.navEc = new Nav().getNavEc();

    // this.getAvatar();
    this.currentUser = JSON.parse(localStorage.getItem('user'))?.fullName;
    this.accountType = JSON.parse(localStorage.getItem('user'))?.accountType;

    if (this.accountType == AccountTypeConstant.MANAGER) {
      this.navItems = navItemsManager
    } else if (this.accountType == AccountTypeConstant.USER) {
      this.navItems = navItemsUser
    }else if (this.accountType == AccountTypeConstant.CHECK_IN) {
      this.navItems = navItemsCheckIn;
      this.sidebarToggler = false;
      this.asideMenuToggler = false;
      this.mobileSidebarToggler = false;
    } else if (this.accountType == AccountTypeConstant.CHECK_OUT) {
      this.navItems = navItemsCheckOut;
      this.sidebarToggler = false;
      this.asideMenuToggler = false;
      this.mobileSidebarToggler = false;

    }else if (this.accountType == AccountTypeConstant.ACCESS_CONTROL) {
      this.navItems = navItemsAccessControl;
      this.sidebarToggler = false;
      this.asideMenuToggler = false;
      this.mobileSidebarToggler = false;

    }
    this.page = 1;
    this.pageSize = 10;

    this.userid = JSON.parse(localStorage.getItem('user'))?.id;
    // this.getMenu();
    this.onService();
    this.currentTime = moment().format('hh:mm:ss A');
    setInterval(() => this.updateCurrentTime(), 1 * 1000);
  }
  ngAfterViewInit() {
  }
  index() {
    if (this.accountType == AccountTypeConstant.MANAGER) {
      return '/staff-info';
    } else if (this.accountType == AccountTypeConstant.USER) {
      return '/access-control';
    }else if (this.accountType == AccountTypeConstant.SYSTEM) {
      return '/dashboard';
    } else if (this.accountType == AccountTypeConstant.CHECK_IN) {
      return '/check-in';
    } else if (this.accountType == AccountTypeConstant.CHECK_OUT) {
      return '/check-out';
    } else if (this.accountType == AccountTypeConstant.ACCESS_CONTROL) {
      return '/access-control';
    }
  }
  getMenu() {
    const navs = JSON.parse(localStorage.getItem('navs'));
    if (navs === null) {
      this.spinner.show();
      console.log('Header ------- Begin getMenuByUserPermission');
      const langID = localStorage.getItem('lang');
      this.permissionService.getMenuByLangID(this.userid, langID).subscribe((navsData: []) => {
        this.navItems = navsData;
        localStorage.setItem('navs', JSON.stringify(navsData));
        this.spinner.hide();

      }, (err) => {
        this.spinner.hide();
      });
      console.log('Header ------- end getMenuByUserPermission');
    } else {
      console.log('Header ------- Begin getlocalstore menu');
      this.navItems = navs;
    }
  }
  home() {
    return '/transaction/todolist2';
  }
  onChange(args) {
    this.spinner.show();
    const lang = args.itemData.id;
    localStorage.removeItem('lang');
    localStorage.setItem('lang', lang);
    this.translate.addLangs(['vi', 'en']);
    this.translate.use(lang);
    this.dataService.setValueLocale(lang);
    window.location.reload();

    // this.permissionService.getMenuByLangID(this.userid, lang).subscribe((navs: []) => {
    //   this.navItems = navs;
    //   localStorage.setItem('navs', JSON.stringify(navs));
    //   this.spinner.hide();
    //   window.location.reload();

    // }, (err) => {
    //   this.spinner.hide();
    // });
  }
  getBuilding() {
    const userID = JSON.parse(localStorage.getItem('user')).user.id;
    this.roleService.getRoleByUserID(userID).subscribe((res: any) => {
      res = res || {};
      if (res !== {}) {
        this.level = res.id;
      }
    });
  }
  onService() {
    this.headerService.currentImage
      .subscribe(arg => {
        if (arg) {
          this.changeAvatar(arg);
        }
      });
  }
  changeAvatar(avt) {
    let avatar;
    if (avt) {
      avatar = avt.replace('data:image/png;base64,', '').trim();
      localStorage.removeItem('avatar');
      localStorage.setItem('avatar', avatar);
      this.getAvatar();
    } else {
      this.avatar = this.defaultImage();
    }

  }

  updateCurrentTime() {
    this.currentTime = moment().format('hh:mm:ss A');
  }
  logout() {
    this.cookieService.deleteAll();
    localStorage.removeItem("user");
    localStorage.removeItem("lang");
    localStorage.removeItem("token");
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.authenticationService.logOut();
    const uri = this.router.url;
    this.router.navigate(['login'], { queryParams: { uri }, replaceUrl: true });
    this.alertify.message('Logged out');

  }

  defaultImage() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAJYAA
      ACWBAMAAADOL2zRAAAAG1BMVEVsdX3////Hy86jqK1+ho2Ql521ur7a3N7s7e5Yhi
      PTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtH
      OTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJ
      J0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvF
      IXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOy
      qPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP
      2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg==`);
  }
  getAvatar() {
    const img = localStorage.getItem('avatar');
    if (img === 'null') {
      this.avatar = this.defaultImage();
    } else {
      this.avatar = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + img);
    }
  }
  imageBase64(img) {
    if (img === 'null') {
      return this.defaultImage();
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + img);
    }
  }
  datetime(d) {
    return this.calendarsService.JSONDateWithTime(d);
  }

  openModal(ref) {
    this.modalReference = this.modalService.open(ref, { size: 'xl', backdrop: 'static', keyboard: false });

  }
}
