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
import { DatePipe } from '@angular/common';
import { PeriodType } from 'src/app/_core/_model/period-type';
import { PeriodTypeService } from 'src/app/_core/_service/period-type.service';

@Component({
  selector: 'app-period',
  templateUrl: './period-type.component.html',
  styleUrls: ['./period-type.component.scss'],
  providers: [DatePipe]
})
export class PeriodTypeComponent extends BaseComponent implements OnInit {
  data: PeriodType[] = [];
  periodItem: PeriodType;
  periodData: Period[] = [];
  password = '';
  modalReference: NgbModalRef;
  fields: object = { text: 'name', value: 'id' };
  filterSettings = { type: 'Excel' };
  // toolbarOptions = ['Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  periodCreate: PeriodType;
  periodUpdate: PeriodType;
  setFocus: any;
  locale = localStorage.getItem('lang');
  periodTypeId: any;
  reportTime: any;
  model: Period;
  monthValueData: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  value: number;
  title: string;
  months: any;
  displayTime: any;
  constructor(
    private service: PeriodTypeService,
    private periodService: PeriodService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) { super(); }

  ngOnInit() {
    // this.Permission(this.route);
    this.loadData();
  }
  // life cycle ejs-grid

  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }
  actionBegin(args) {
    console.log(args);
    if (args.requestType === 'beginEdit') {
      const item = args.rowData;
    }
    if (args.requestType === 'save' && args.action === 'add') {
      this.periodCreate = {
        id: 0,
        name: args.data.name,
        code: args.data.code,
        displayBefore: args.data.displayBefore,
        position: args.data.position,
      };

      if (args.data.name === undefined) {
        this.alertify.error('Please key in a name! <br> Vui lòng nhập tên nhóm tài khoản!');
        args.cancel = true;
        return;
      }
      console.log('create data: ', args.data);

      // this.create();
    }
    if (args.requestType === 'save' && args.action === 'edit') {
      this.periodUpdate = {
        id: args.data.id,
        name: args.data.name,
        displayBefore: args.data.displayBefore,
        code: args.data.code,
        position: args.data.position,
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
    if (args.requestType === 'add') {
      args.form.elements.namedItem('name').focus(); // Set focus to the Target element
    }
  }

  // end life cycle ejs-grid

  // api

  loadData() {
    this.service.getAll().subscribe(data => {
      this.data = data;
    });
  }

  loadPeriodData() {
    this.periodService.getAllByPeriodTypeId(this.periodTypeId).subscribe(data => {
      this.periodData = data;
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
          this.periodCreate = {} as PeriodType;
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

  onChangeReportTime(value: Date): void {
    this.reportTime = this.datePipe.transform(value, "YYYY-MM-dd HH:mm");

  }
  showModal(name, value) {
    this.periodItem = value;
    this.periodTypeId = +value.id;
    this.loadPeriodData();
    this.modalReference = this.modalService.open(name, { size: 'xl' });
  }
  initialModel() {
    this.months = null,
    this.reportTime = new Date();
    this.model = {
      id: 0,
      periodTypeId: this.periodTypeId,
      reportTime: this.datePipe.transform(this.reportTime, "YYYY-MM-dd HH:mm"),
      modifiedBy: null,
      createdTime: this.datePipe.transform(new Date(), "YYYY-MM-dd HH:mm"),
      modifiedTime: null,
      value: 0,
      title: null,
      months: null,
    }
  }

  updateModel(data) {
    this.months = data.months?.split(',').map(x=>+x),
    this.reportTime =  new Date(data.reportTime);
    this.model = {
      id: data.id,
      periodTypeId: this.periodTypeId,
      reportTime: data.reportTime,
      modifiedBy: data.modifiedBy,
      createdTime: data.createdTime,
      modifiedTime: data.modifiedTime,
      value: data.value,
      title: data.title,
      months: this.months,
    }
  }
  actionBeginPeriodsGrid(args) {
    if (args.requestType === 'cancel') {
      this.initialModel();
    }
    if (args.requestType === 'add') {
      this.initialModel();
    }
    if (args.requestType === 'beginEdit') {
      const item = args.rowData;
      this.updateModel(item);
    }
    if (args.requestType === 'save') {
      if (args.action === 'add') {
        const data = args.data;
        this.model = {
          id: 0,
          periodTypeId: this.periodTypeId,
          reportTime: this.datePipe.transform(this.reportTime, "YYYY-MM-dd HH:mm"),
          modifiedBy: null,
          createdTime: this.datePipe.transform(new Date(), "YYYY-MM-dd HH:mm"),
          modifiedTime: null,
          value: data.value,
          title: data.title,
          months: this.months.join(),
        }

        this.createPeriodReportTime();
      }
      if (args.action === 'edit') {
        const data = args.data;
        this.model = {
          id: data.id,
          periodTypeId: this.periodTypeId,
          reportTime: this.datePipe.transform(this.reportTime, "YYYY-MM-dd HH:mm"),
          modifiedBy: data.modifiedBy,
          createdTime: data.createdTime,
          modifiedTime: data.modifiedTime,
          value: data.value,
          title: data.title,
          months: this.months.join(),
        }
        this.updatePeriodReportTime();
      }
    }
    if (args.requestType === 'delete') {
      this.deletePeriodReportTime(args.data[0].id);
    }
  }

  deletePeriodReportTime(id) {
    this.periodService.delete(id).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(MessageConstants.DELETED_OK_MSG);
          this.loadPeriodData();
        } else {
          this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
        }
      },
      (err) => this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG)
    );

  }
  createPeriodReportTime() {
    this.periodService.add(this.model).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(MessageConstants.CREATED_OK_MSG);
          this.initialModel();
          this.loadPeriodData();
        } else {
          this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
        }

      },
      (error) => {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    );
  }
  updatePeriodReportTime() {
    this.periodService.update(this.model).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(MessageConstants.UPDATED_OK_MSG);
          this.loadPeriodData();
        } else {
          this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
        }
      },
      (error) => {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    );
  }
}

