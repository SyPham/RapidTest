import { GhrReportComponent } from './ghr-report/ghr-report.component';
import { HqHrReportComponent } from './hq-hr-report/hq-hr-report.component';
import { H1H2ReportComponent } from './h1-h2-report/h1-h2-report.component';
import { Q1Q3ReportComponent } from './q1-q3-report/q1-q3-report.component';

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    data: {
      title: '',
      breadcrumb: 'System'
    },
    children: [
      {
        path: 'q1-q3-report',
        component: Q1Q3ReportComponent,
        data: {
          title: 'Q1,Q3 Report 季報表',
          breadcrumb: 'Q1,Q3 Report 季報表',
          functionCode: 'q1-q3-report'
        },
        // canActivate: [AuthGuard]
      },
      {
        path: 'h1-h2-report',
        component: H1H2ReportComponent,
        data: {
          title: 'H1 & H2 Report',
          breadcrumb: 'H1 & H2 Report',
          functionCode: 'h1-h2-report'
        },
        // canActivate: [AuthGuard]
      },
      {
        path: 'hq-hr-report',
        component: HqHrReportComponent,
        data: {
          title: 'HQ HR Report 年中考核名單',
          breadcrumb: 'HQ HR Report 年中考核名單',
          functionCode: 'q1-q3-report'
        },
        // canActivate: [AuthGuard]
      },
      {
        path: 'ghr-report',
        component: GhrReportComponent,
        data: {
          title: 'GHR Report',
          breadcrumb: 'GHR Report',
          functionCode: 'ghr-report'
        },
        // canActivate: [AuthGuard]
      },
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
