import { AccountGroupPeriodService } from './../../../../_core/_service/account.groupperiod.service';
import { PeriodReportTime } from './../../../../_core/_model/period.report.time';
import { AccountGroupService } from './../../../../_core/_service/account.group.service';
import { Period } from '../../../../_core/_model/period';
import { BaseComponent } from 'src/app/_core/_component/base.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { PeriodService } from 'src/app/_core/_service/period.service';
import { AccountGroup } from 'src/app/_core/_model/account.group';
import { DatePipe } from '@angular/common';
import { PeriodReportTimeService } from 'src/app/_core/_service/period.report.time.service';
import { AccountGroupPeriod } from 'src/app/_core/_model/account.group.period';

@Component({
  selector: 'app-period',
  templateUrl: './account-group-period.component.html',
  styleUrls: ['./account-group-period.component.scss'],
  providers: [DatePipe]
})
export class AccountGroupPeriodComponent extends BaseComponent implements OnInit {
  data: AccountGroupPeriod[] = [];
  periodReportTimeData: PeriodReportTime[] = [];
  password = '';
  modalReference: NgbModalRef;
  fields: object = { text: 'name', value: 'id' };
  filterSettings = { type: 'Excel' };
  // toolbarOptions = ['Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  periodCreate: AccountGroupPeriod;
  periodUpdate: AccountGroupPeriod;
  setFocus: any;
  locale = localStorage.getItem('lang');
  accountGroupData: AccountGroup[];
  accountGroupId: any;
  periodId: any;
  reportTime: any;
  model: PeriodReportTime;
  periodData: Period[];
  constructor(
    private service: AccountGroupPeriodService,
    private periodService: PeriodService,
    private periodReportTimeService: PeriodReportTimeService,
    private accountGroupService: AccountGroupService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) { super(); }

  ngOnInit() {
    // this.Permission(this.route);
    this.loadData();
    this.loadPeriodData();
    this.loadAccountGroupData();
  }
  // life cycle ejs-grid

  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }
  actionBegin(args) {
    if (args.requestType === 'beginEdit') {
      const item = args.rowData;
      this.accountGroupId = item.accountGroupId;
      this.periodId = item.periodId;
    }
    if (args.requestType === 'save' && args.action === 'add') {
      this.periodCreate = {
        id: 0,
        periodId: this.periodId,
        accountGroupId: this.accountGroupId,
        period: null,
        accountGroup: null,
      };

      this.create();
    }
    if (args.requestType === 'save' && args.action === 'edit') {
      this.periodCreate = {
        id: 0,
        periodId: this.periodId,
        accountGroupId: this.accountGroupId,
        period: null,
        accountGroup: null,
      };

      this.update();
    }
    if (args.requestType === 'delete') {
      this.delete(args.data[0].id);
    }
  }
  toolbarClick(args) {
    switch (args.item.id) {
      case 'grid_excelexport':
        this.grid.excelExport({ hierarchyExportMode: 'All' });
        break;
      default:
        break;
    }
  }
  actionComplete(args) {
    // if (args.requestType === 'add') {
    //   args.form.elements.namedItem('name').focus(); // Set focus to the Target element
    // }
  }

  // end life cycle ejs-grid

  // api

  loadData() {
    this.service.getAll().subscribe(data => {
      this.data = data;
    });
  }
  loadAccountGroupData() {
    this.accountGroupService.getAll().subscribe(data => {
      this.accountGroupData = data;
    });
  }
  loadPeriodData() {
    this.periodService.getAll().subscribe(data => {
      this.periodData = data;
    });
  }
  loadPeriodReportTimeData() {
    this.periodReportTimeService.getAll().subscribe(data => {
      this.periodReportTimeData = data;
    });
  }
  delete(id) {
    this.service.delete(id).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(MessageConstants.DELETED_OK_MSG);
          this.loadData();
        } else {
           this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
        }
      },
      (err) => this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG)
    );

  }
  create() {
    this.service.add(this.periodCreate).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(MessageConstants.CREATED_OK_MSG);
          this.loadData();
          this.periodCreate = {} as AccountGroupPeriod;
        } else {
           this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
        }

      },
      (error) => {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    );
  }
  update() {
    this.service.update(this.periodUpdate).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(MessageConstants.UPDATED_OK_MSG);
          this.loadData();
        } else {
          this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
        }
      },
      (error) => {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    );
  }
  // end api
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
  }
  onChangeAccountGroup(args) {
    console.log(args);
    this.accountGroupId = args.itemData.id;
  }
  onChangePeriod(args) {
    console.log(args);
    this.periodId = args.itemData.id;
  }
}

