import { GhrReportComponent } from './ghr-report/ghr-report.component';
import { HqHrReportComponent } from './hq-hr-report/hq-hr-report.component';
import { H1H2ReportComponent } from './h1-h2-report/h1-h2-report.component';
import { Q1Q3ReportComponent } from './q1-q3-report/q1-q3-report.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CheckBoxAllModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownListModule,  MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { L10n, loadCldr, setCulture } from '@syncfusion/ej2-base';
import { ReportRoutingModule } from '../report/report.routing.module';


import { HttpClient } from '@angular/common/http';
import { TabModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';

import { TreeGridAllModule } from '@syncfusion/ej2-angular-treegrid';


import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { TooltipAllModule } from '@syncfusion/ej2-angular-popups';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
declare var require: any;
let defaultLang: string;
const lang = localStorage.getItem('lang');
loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/en/ca-gregorian.json'),
  require('cldr-data/main/en/numbers.json'),
  require('cldr-data/main/en/timeZoneNames.json'),
  require('cldr-data/supplemental/weekdata.json')); // To load the culture based first day of week

loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/vi/ca-gregorian.json'),
  require('cldr-data/main/vi/numbers.json'),
  require('cldr-data/main/vi/timeZoneNames.json'),
  require('cldr-data/supplemental/weekdata.json')); // To load the culture based first day of week
if (lang === 'vi') {
  defaultLang = lang;
} else {
  defaultLang = 'en';
}

@NgModule({
  imports: [
    NgxPrettyCheckboxModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropDownListModule,
    GridAllModule,
    TreeGridAllModule,
    CheckBoxAllModule,
    SwitchModule,
    ReportRoutingModule,
    DateInputsModule ,
    ToolbarModule,
    TooltipAllModule,
    MultiSelectAllModule,
    DatePickerModule,
    TabModule,
    SpreadsheetAllModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: defaultLang
    }),
  ],
  declarations: [
    Q1Q3ReportComponent,
    H1H2ReportComponent,
    HqHrReportComponent,
    GhrReportComponent

  ]
})
export class ReportModule { vi: any;
  en: any;
  constructor() {
    if (lang === 'vi') {
      defaultLang = 'vi';
      setTimeout(() => {
        L10n.load(require('../../../../assets/ej2-lang/vi.json'));
        setCulture('vi');
      });
    } else {
      defaultLang = 'en';
      setTimeout(() => {
        L10n.load(require('../../../../assets/ej2-lang/en.json'));
        setCulture('en');
      });
    }
  }
}
