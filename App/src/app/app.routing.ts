import { RecordErrorComponent } from './views/protect-zone/record-error/record-error.component';
import { BlackListComponent } from './views/protect-zone/black-list/black-list.component';
import { CheckInReportComponent } from './views/protect-zone/check-in-report/check-in-report.component';
import { DashboardComponent } from './views/protect-zone/dashboard/dashboard.component';
import { SettingComponent } from './views/protect-zone/setting/setting.component';
import { TestKindComponent } from './views/protect-zone/test-kind/test-kind.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard } from './_core/_guards/auth.guard';
import { AccountComponent } from './views/protect-zone/account/account.component';
import { StaffInfoComponent } from './views/protect-zone/staff-info/staff-info.component';
import { RapidTestReportComponent } from './views/protect-zone/rapid-test-report/rapid-test-report.component';
import { ReportFactoryComponent } from './views/protect-zone/report-factory/report-factory.component';
import { AccessControlComponent } from './views/protect-zone/access-control/access-control.component';
import { CheckInComponent } from './views/protect-zone/check-in/check-in.component';
import { CheckOutComponent } from './views/protect-zone/check-out/check-out.component';
import { AuthLocalGuard } from './_core/_guards/auth-local.guard';
import { CheckOutSettingComponent } from './views/protect-zone/check-out-setting/check-out-setting.component';
import { AccessDayComponent } from './views/protect-zone/access-day/access-day.component';
import { AccessFailedComponent } from './views/protect-zone/access-failed/access-failed.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    runGuardsAndResolvers: 'always',
    // canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'account',
        component: AccountComponent,
        data: {
          title: 'Account'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'setting',
        component: SettingComponent,
        data: {
          title: 'Access days (Đi làm)'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'access-day',
        component: AccessDayComponent,
        data: {
          title: 'Access days (3 tại chỗ)'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'staff-info',
        component: StaffInfoComponent,
        data: {
          title: 'Staff Info'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'report1',
        component: RapidTestReportComponent,
        data: {
          title: 'Rapid Test Report'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'report-factory',
        component: ReportFactoryComponent,
        data: {
          title: 'Access Control Report'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'check-out',
        component: CheckOutComponent,
        data: {
          title: '2.Kết quả xét nghiệm - Check Out'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'check-in',
        component: CheckInComponent,
        data: {
          title: '1.Đăng ký xét nghiệm - Check In'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'access-control',
        component: AccessControlComponent,
        data: {
          title: '3.Kiểm soát vào nhà máy - Access Control'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'test-kind',
        component: TestKindComponent,
        data: {
          title: 'Test Kind'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard'
        },
        //canActivate: [AuthLocalGuard]
      },
      {
        path: 'check-in-report',
        component: CheckInReportComponent,
        data: {
          title: 'Check in report'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'check-out-setting',
        component: CheckOutSettingComponent,
        data: {
          title: 'Check Out Setting'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'black-list',
        component: BlackListComponent,
        data: {
          title: 'Black List'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'record-error',
        component: RecordErrorComponent,
        data: {
          title: 'Record Error'
        },
        canActivate: [AuthLocalGuard]
      },
      {
        path: 'access-failed',
        component: AccessFailedComponent,
        data: {
          title: 'Access failed'
        },
        canActivate: [AuthLocalGuard]
      },
    ]
  }, // otherwise redirect to home
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      { relativeLinkResolution: 'legacy', useHash: true , scrollPositionRestoration: 'enabled'  }
      ) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
