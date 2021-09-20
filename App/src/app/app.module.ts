import { CheckOutComponent } from './views/protect-zone/check-out/check-out.component';
import { CheckInComponent } from './views/protect-zone/check-in/check-in.component';
import { AccessControlComponent } from './views/protect-zone/access-control/access-control.component';
import { ReportFactoryComponent } from './views/protect-zone/report-factory/report-factory.component';
import { RapidTestReportComponent } from './views/protect-zone/rapid-test-report/rapid-test-report.component';
import { StaffInfoComponent } from './views/protect-zone/staff-info/staff-info.component';
import { ScrollToTopComponent } from './containers/scrollToTop/scrollToTop.component';
import { FooterComponent } from './views/layout/footer/footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { LayoutComponent } from './views/layout/layout/layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownListAllModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';

import { MomentModule } from 'ngx-moment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { CoreModule } from './_core/core.module';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { ImageCropperModule } from 'ngx-image-cropper';
import { JwtModule } from '@auth0/angular-jwt';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SafePipeModule } from 'safe-pipe';
import { MentionModule } from 'angular-mentions';
import { BasicAuthInterceptor } from './_core/_helper/basic-auth.interceptor';
import { ErrorInterceptorProvider } from './_core/_service/error.interceptor';
import { AuthGuard } from './_core/_guards/auth.guard';
import { AlertifyService } from './_core/_service/alertify.service';
import { Authv2Service } from './_core/_service/authv2.service';
import { HttpLoaderFactory } from './views/protect-zone/system/system.module';
import * as $ from "jquery";
import { AccountComponent } from './views/protect-zone/account/account.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
export function tokenGetter() {
  return localStorage.getItem('token');
}
import { QRCodeGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator';
const rapidTestComponent = [
  AccountComponent,
  StaffInfoComponent,
  RapidTestReportComponent,
  ReportFactoryComponent,
  AccessControlComponent,
  CheckInComponent,
  CheckOutComponent
];
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DropDownListAllModule,
    MultiSelectModule,
    HttpClientModule,
    SafePipeModule,
    GridAllModule,
    MomentModule,
    InfiniteScrollModule,
    MentionModule,
    ImageCropperModule,
    UploaderModule,
    CoreModule,
    NgxSpinnerModule,
    DatePickerModule ,
    QRCodeGeneratorAllModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'vi'
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['10.4.0.76:1009'],
        disallowedRoutes: ['10.4.0.76:1009/api/auth']
      }
    }),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    ...rapidTestComponent,
    P404Component,
    P500Component,
    LoginComponent,
    LayoutComponent,
    ScrollToTopComponent,
    RegisterComponent
  ],
  providers: [
    AuthGuard,
    AlertifyService,
    AuthGuard,
    NgxSpinnerService,
    ErrorInterceptorProvider,
    Authv2Service,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    IconSetService,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
