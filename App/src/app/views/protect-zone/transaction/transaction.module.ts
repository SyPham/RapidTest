import { UploadFileComponent } from './todolist2/upload-file/upload-file.component';
import { PdcaComponent } from './todolist2/pdca/pdca.component';
import { PlanComponent } from './todolist2/plan/plan.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AttitudeScoreComponent } from './todolist/attitude-score/attitude-score.component';
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

import { HttpClient } from '@angular/common/http';
import { ObjectiveComponent } from './objective/objective.component';
import { TransactionRoutingModule } from './transaction.routing.module';
import { TodolistComponent } from './todolist/todolist.component';
import { TabModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { ActionComponent } from './todolist/action/action.component';
import { UpdateResultComponent } from './todolist/update-result/update-result.component';
import { SelfScoreComponent } from './todolist/self-score/self-score.component';
import { KpiScoreComponent } from './todolist/kpi-score/kpi-score.component';
import { AttitudeScoreL2Component } from './todolist/attitude-score-l2/attitude-score-l2.component';
import { KpiScoreGHRComponent } from './todolist/kpi-score-ghr/kpi-score-ghr.component';
import { KpiScoreGMComponent } from './todolist/kpi-score-gm/kpi-score-gm.component';
import { AttitudeScoreGHRComponent } from './todolist/attitude-score-ghr/attitude-score-ghr.component';
import { TreeGridAllModule } from '@syncfusion/ej2-angular-treegrid';
import { AttitudeScoreFunctionalLeaderComponent } from './todolist/attitude-score-functional-leader/attitude-score-functional-leader.component';
import { KpiScoreL2Component } from './todolist/kpi-score-l2/kpi-score-l2.component';

import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { NgTemplateNameDirective } from './ng-template-name.directive';
import { UploadKpiComponent } from './todolist/upload-kpi/upload-kpi.component';
import { Todolist2Component } from './todolist2/todolist2.component';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';

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
  declarations: [
    ObjectiveComponent,
    TodolistComponent,
    Todolist2Component,
    ActionComponent,
    UpdateResultComponent,
    SelfScoreComponent,
    KpiScoreComponent,
    KpiScoreL2Component,
    AttitudeScoreComponent,
    AttitudeScoreFunctionalLeaderComponent,
    AttitudeScoreL2Component,
    KpiScoreGHRComponent,
    KpiScoreGMComponent,
    AttitudeScoreGHRComponent,
    NgTemplateNameDirective,
    UploadKpiComponent,
    PlanComponent,
    PdcaComponent,
    UploadFileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropDownListModule,
    GridAllModule,
    TreeGridAllModule,
    CheckBoxAllModule,
    SwitchModule,
    TransactionRoutingModule,
    DateInputsModule ,
    ToolbarModule,
    MultiSelectAllModule,
    DatePickerModule,
    TabModule,
    SpreadsheetAllModule,
    UploaderModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: defaultLang
    }),
  ]
})
export class TransactionModule   {
  vi: any;
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
