import { KpiCreateComponent } from './kpi-create/kpi-create.component';
import { PolicyComponent } from './policy/policy.component';
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from 'src/app/_core/_guards/auth.guard'

import { OcUserComponent } from './oc-user/oc-user.component'
import { OcComponent } from './oc/oc.component'
import { AccountGroupPeriodComponent } from './account-group-period/account-group-period.component'
import { AccountGroupComponent } from './account-group/account-group.component'
import { AccountComponent } from './account/account.component'
import { ProgressComponent } from './progress/progress.component'
import { PeriodTypeComponent } from './period-type/period-type.component'

// import { PeriodComponent } from './period/period.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'System',
      breadcrumb: 'System'
    },
    children: [
      {
        path: 'account',
        component: AccountComponent,
        data: {
          title: 'Account',
          breadcrumb: 'Account',
          functionCode: 'account'
        },
        // canActivate: [AuthGuard]
      },
      {
        path: 'account-group',
        component: AccountGroupComponent,
        data: {
          title: 'Account Group',
          breadcrumb: 'Account Group',
          functionCode: 'account-group'
        },
        // canActivate: [AuthGuard]
      },
      {
        path: 'progress',
        component: ProgressComponent,
        data: {
          title: 'Progress',
          breadcrumb: 'Progress',
          functionCode: 'progress'
        },
        // canActivate: [AuthGuard]
      },
      {
        path: 'period',
        component: PeriodTypeComponent,
        data: {
          title: 'Period',
          breadcrumb: 'Period',
          functionCode: 'period'
        },
        // canActivate: [AuthGuard]
      },
      {
        path: 'account-group-period',
        component: AccountGroupPeriodComponent,
        data: {
          title: 'Account Group Period',
          breadcrumb: 'Account Group Period',
          functionCode: 'account-group-period'
        },
        // canActivate: [AuthGuard]
      },
      {
        path: 'oc',
        component: OcComponent,
        data: {
          title: 'OC',
          breadcrumb: 'OC',
          functionCode: 'oc'
        },
        // canActivate: [AuthGuard]
      },
      {
        path: 'oc-user',
        component: OcUserComponent,
        data: {
          title: 'OC User',
          breadcrumb: 'OC User',
          functionCode: 'oc-user'
        },
        // canActivate: [AuthGuard]
      },
      {
        path: 'policy',
        component: PolicyComponent,
        data: {
          title: 'Policy',
          breadcrumb: 'Policy',
          functionCode: 'policy'
        },
        // canActivate: [AuthGuard]
      },
      {
        path: 'kpi-create',
        component: KpiCreateComponent,
        data: {
          title: 'KPI Create',
          breadcrumb: 'KPI Create',
          functionCode: 'kpi-create'
        },
        // canActivate: [AuthGuard]
      }

    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
