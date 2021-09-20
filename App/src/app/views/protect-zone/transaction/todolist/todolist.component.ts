import { PerformanceService } from './../../../../_core/_service/performance.service';
import { Subscription } from 'rxjs';
import { KpiScoreComponent } from './kpi-score/kpi-score.component';
import { AccountGroupService } from './../../../../_core/_service/account.group.service';
import { Component, OnInit, TemplateRef, ViewChild, QueryList, ViewChildren, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ObjectiveService } from 'src/app/_core/_service/objective.service';
import { ActionComponent } from './action/action.component';
import { SelfScoreComponent } from './self-score/self-score.component';
import { UpdateResultComponent } from './update-result/update-result.component';
import { AccountGroup } from 'src/app/_core/_model/account.group';
import { AttitudeScoreComponent } from './attitude-score/attitude-score.component';
import { Todolistv2Service } from 'src/app/_core/_service/todolistv2.service';
import { PeriodType, SystemRole, ToDoListType, SystemScoreType } from 'src/app/_core/enum/system';
import { AttitudeScoreL2Component } from './attitude-score-l2/attitude-score-l2.component';
import { AttitudeScoreGHRComponent } from './attitude-score-ghr/attitude-score-ghr.component';
import { KpiScoreGMComponent } from './kpi-score-gm/kpi-score-gm.component';
import { KpiScoreGHRComponent } from './kpi-score-ghr/kpi-score-ghr.component';
import { environment } from 'src/environments/environment';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { Performance } from 'src/app/_core/_model/performance';
import { DatePipe } from '@angular/common';
import { AttitudeScoreFunctionalLeaderComponent } from './attitude-score-functional-leader/attitude-score-functional-leader.component';
import { KpiScoreL2Component } from './kpi-score-l2/kpi-score-l2.component';
import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { NgTemplateNameDirective } from '../ng-template-name.directive';
import { Router } from '@angular/router';
@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss'],
  providers: [DatePipe]
})
export class TodolistComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid: GridComponent;
  @ViewChildren(NgTemplateNameDirective) public Gridtemplates: QueryList<NgTemplateNameDirective>;
  gridData: object;
  toolbarOptions = ['Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  editSettings = { showDeleteConfirmDialog: false, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
  accountGroupData: AccountGroup[];
  KPI = ToDoListType.KPI as string;
  Attitude = ToDoListType.Attitude as string;
  scoreType: SystemScoreType;
  modalReference: NgbModalRef;
  @ViewChild('importModal') importModal: NgbModalRef;
  file: any;
  excelDownloadUrl: string;
  currentTime: any;
  currentTimeRequest: any;
  index: any = 1;
  subscription: Subscription[] = [];
  @ViewChild('remoteDataBinding')
  public spreadsheetObj: SpreadsheetComponent;
  public sheetName = 'Upload Details';
  isAuthorize = false;
  content: string;
  constructor(
    private service: ObjectiveService,
    private router: Router,
    private alertify: AlertifyService,
    public todolistService: Todolistv2Service,
    private accountGroupService: AccountGroupService,
    public modalService: NgbModal,
    private datePipe: DatePipe,
    private performanceService: PerformanceService
  ) {
  }
  ngOnDestroy(): void {
    // this.subscription.forEach(item => item.unsubscribe());
  }
  onChangeReportTime(value: Date): void {
    this.loadData();
  }
  ngOnInit(): void {
    this.currentTime = new Date();
    this.content = '';
    this.loadAccountGroupData();
    this.subscription.push(this.todolistService.currentMessage.subscribe(message => { if (message) { this.loadData(); } }));
  }
  isAllowAccess(position: number) {
    const positions = JSON.parse(localStorage.getItem('user')).accountGroupPositions as number[] || [];
    return positions.includes(position);
  }
  loadData() {
    this.currentTimeRequest = this.datePipe.transform(this.currentTime, "YYYY-MM-dd HH:mm");
    let systemRole = 0;
    if (this.content === '') {
      this.content = this.accountGroupData[0]?.name;
      systemRole =SystemRole[this.accountGroupData[0]?.name] as any  || 0;
    } else {
      systemRole =SystemRole[this.content] as any  || 0;

    }
    switch (systemRole) {
      case SystemRole.L0:
        this.scoreType = SystemScoreType.L0;
        this.loadDataL0();
        break;
      case SystemRole.L1:
        this.scoreType = SystemScoreType.L1;
        this.loadDataL1();
        break;
      case SystemRole.FunctionalLeader:
        this.scoreType = SystemScoreType.FunctionalLeader;
        this.loadDataFunctionalLeader();
        break;
      case SystemRole.L2:
        this.scoreType = SystemScoreType.L2;
        this.loadDataL2();
        break;
      case SystemRole.Updater:
        this.scoreType = SystemScoreType.FHO;
        this.loadDataUpdater();
        break;
      case SystemRole.GHR:
        this.scoreType = SystemScoreType.GHR;
        this.loadDataGHR();
        break;
      case SystemRole.GM:
        this.loadDataGM();
        this.scoreType = SystemScoreType.GM;
        break;
    }
  }

  selected(args) {
    this.currentTimeRequest = this.datePipe.transform(this.currentTime, "YYYY-MM-dd HH:mm");
    const index = args.selectedIndex + 1;
    this.index = index;
    let systemRole = 0;
    this.content =args.selectedItem.outerText;
    if (this.content === '') {
      this.content = this.accountGroupData[0]?.name;
      systemRole =SystemRole[this.accountGroupData[0]?.name] as any  || 0;
    } else {
      systemRole = SystemRole[args.selectedItem.outerText] as any ;

    }
    switch (systemRole) {
      case SystemRole.L0:
        this.scoreType = SystemScoreType.L0;
        this.loadDataL0();
        break;
      case SystemRole.L1:
        this.scoreType = SystemScoreType.L1;
        this.loadDataL1();
        break;
      case SystemRole.GFL:
        this.scoreType = SystemScoreType.FunctionalLeader;
        this.loadDataFunctionalLeader();
        break;
      case SystemRole.L2:
        this.scoreType = SystemScoreType.L2;
        this.loadDataL2();
        break;
      case SystemRole.Updater:
        this.scoreType = SystemScoreType.FHO;
        this.loadDataUpdater();
        break;
      case SystemRole.GHR:
        this.scoreType = SystemScoreType.GHR;
        this.loadDataGHR();
        break;
      case SystemRole.GM:
        this.loadDataGM();
        this.scoreType = SystemScoreType.GM;
        break;
    }
  }
  getGridTemplate(name): TemplateRef<any> {
    const dir = this.Gridtemplates.find(dir => dir.name === name + '');
  return dir ? dir.template : null
  }
  loadDataL0() {
    this.gridData = [];
    this.todolistService.l0(this.currentTimeRequest).subscribe(data => {
      this.gridData = data;
    });
  }

  loadDataL1() {
    this.gridData = [];
    this.todolistService.l1(this.currentTimeRequest).subscribe(data => {
      this.gridData = data;
    });
  }
  loadDataUpdater() {
    this.gridData = [];
    this.todolistService.updater(this.currentTimeRequest).subscribe(data => {
      this.gridData = data;
    });
  }
  loadDataFunctionalLeader() {
    this.gridData = [];
    this.todolistService.functionalLeader(this.currentTimeRequest).subscribe(data => {
      this.gridData = data;
    });
  }
  loadDataL2() {
    this.gridData = [];
    this.todolistService.l2(this.currentTimeRequest).subscribe(data => {
      this.gridData = data;
    });
  }
  loadDataFHO() {
    this.gridData = [];
    this.todolistService.fho(this.currentTimeRequest).subscribe(data => {
      this.gridData = data;
    });
  }
  loadDataGHR() {
    this.gridData = [];
    this.todolistService.ghr(this.currentTimeRequest).subscribe(data => {
      this.gridData = data;
    });
  }
  loadDataGM() {
    this.gridData = [];
    this.todolistService.gm(this.currentTimeRequest).subscribe(data => {
      this.gridData = data;
    });
  }
  loadAccountGroupData() {
    this.accountGroupService.getAccountGroupForTodolistByAccountId().subscribe(data => {
      this.accountGroupData = data;
      this.loadData();
    });
  }
  gotoUpdate() {
    return this.router.navigateByUrl('/transaction/upload-kpi-objective');
  }

  openActionModalComponent(data) {
    const modalRef = this.modalService.open(ActionComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.isReject = data.isReject;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  openUpdateResultModalComponent(data) {
    const modalRef = this.modalService.open(UpdateResultComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.currentTime = this.currentTime;
    modalRef.componentInstance.isReject = data.isReject;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  openSelfScoreModalComponent(data) {
    const modalRef = this.modalService.open(SelfScoreComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.periodTypeCode = PeriodType.Monthly;
    modalRef.componentInstance.scoreType = this.scoreType;

    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  openKPIScoreModalComponent(data) {
    const modalRef = this.modalService.open(KpiScoreComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.periodTypeCode = PeriodType.Quarterly;
    modalRef.componentInstance.scoreType = this.scoreType;
    modalRef.componentInstance.currentTime = this.currentTime;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  openKPIScoreL2ModalComponent(data) {
    const modalRef = this.modalService.open(KpiScoreL2Component, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.periodTypeCode = PeriodType.Quarterly;
    modalRef.componentInstance.scoreType = this.scoreType;
    modalRef.componentInstance.currentTime = this.currentTime;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  openKPIScoreGHRModalComponent(data) {
    const modalRef = this.modalService.open(KpiScoreGHRComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.periodTypeCode = PeriodType.Quarterly;
    modalRef.componentInstance.scoreType = this.scoreType;
    modalRef.componentInstance.currentTime = this.currentTime;

    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  openKPIScoreGMModalComponent(data) {
    const modalRef = this.modalService.open(KpiScoreGMComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.periodTypeCode = PeriodType.Quarterly;
    modalRef.componentInstance.scoreType = this.scoreType;
    modalRef.componentInstance.currentTime = this.currentTime;

    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  openAttitudeScoreModalComponent(data) {
    const modalRef = this.modalService.open(AttitudeScoreComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.scoreType = this.scoreType;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  openAttitudeScoreL2ModalComponent(data) {
    const modalRef = this.modalService.open(AttitudeScoreL2Component, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.scoreType = this.scoreType;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  openAttitudeScoreGHRModalComponent(data) {
    const modalRef = this.modalService.open(AttitudeScoreGHRComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.scoreType = this.scoreType;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  openAttitudeScoreFunctionalLeaderModalComponent(data) {
    const modalRef = this.modalService.open(AttitudeScoreFunctionalLeaderComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.scoreType = this.scoreType;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  openImportExcelModalComponent() {
    this.excelDownloadUrl = `${environment.apiUrl}todolist/ExcelExport`;
    this.modalReference = this.modalService.open(this.importModal, { size: 'xl' });
  }
  fileProgress(event) {
    this.file = event.target.files[0];
  }
  uploadFile() {
    const uploadBy = JSON.parse(localStorage.getItem('user')).id;
    this.todolistService.import(this.file, uploadBy)
      .subscribe((res: any) => {
        this.loadDataFHO();
        this.alertify.success('The excel has been imported into system!');
        this.modalService.dismissAll();
      }, error => {
        this.alertify.error(error, true);
      });
  }
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
  }
}
