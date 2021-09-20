// import { PeriodReportTime } from './../../../../_core/_model/period.report.time';
// import { AccountGroupService } from './../../../../_core/_service/account.group.service';
// import { Period } from '../../../../_core/_model/period';
// import { BaseComponent } from 'src/app/_core/_component/base.component';
// import { Component, OnInit, ViewChild } from '@angular/core';
// import { AlertifyService } from 'src/app/_core/_service/alertify.service';
// import { GridComponent } from '@syncfusion/ej2-angular-grids';
// import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// import { ActivatedRoute } from '@angular/router';
// import { MessageConstants } from 'src/app/_core/_constants/system';
// import { PeriodService } from 'src/app/_core/_service/period.service';
// import { AccountGroup } from 'src/app/_core/_model/account.group';
// import { DatePipe } from '@angular/common';
// import { PeriodReportTimeService } from 'src/app/_core/_service/period.report.time.service';
// import { PeriodType } from 'src/app/_core/_model/period-type';

// @Component({
//   selector: 'app-period',
//   templateUrl: './period.component.html',
//   styleUrls: ['./period.component.scss'],
//   providers: [DatePipe]
// })
// export class PeriodComponent extends BaseComponent implements OnInit {
//   data: PeriodType[] = [];
//   periodReportTimeData: PeriodReportTime[] = [];
//   password = '';
//   modalReference: NgbModalRef;
//   fields: object = { text: 'name', value: 'id' };
//   filterSettings = { type: 'Excel' };
//   // toolbarOptions = ['Search'];
//   pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
//   @ViewChild('grid') public grid: GridComponent;
//   periodCreate: PeriodType;
//   periodUpdate: PeriodType;
//   setFocus: any;
//   locale = localStorage.getItem('lang');
//   periodId: any;
//   reportTime: any;
//   model: PeriodReportTime;
//   constructor(
//     private service: PeriodService,
//     private periodReportTimeService: PeriodReportTimeService,
//     public modalService: NgbModal,
//     private alertify: AlertifyService,
//     private route: ActivatedRoute,
//     private datePipe: DatePipe,
//   ) { super(); }

//   ngOnInit() {
//     // this.Permission(this.route);
//     this.loadData();
//   }
//   // life cycle ejs-grid

//   onDoubleClick(args: any): void {
//     this.setFocus = args.column; // Get the column from Double click event
//   }
//   actionBegin(args) {
//     if (args.requestType === 'beginEdit') {
//       const item = args.rowData;
//     }
//     if (args.requestType === 'save' && args.action === 'add') {
//       this.periodCreate = {
//         id: 0,
//         name: args.data.name ,
//         code: args.data.code ,
//         position: args.data.position ,
//       };

//       if (args.data.name === undefined) {
//         this.alertify.error('Please key in a name! <br> Vui lòng nhập tên nhóm tài khoản!');
//         args.cancel = true;
//         return;
//       }

//       this.create();
//     }
//     if (args.requestType === 'save' && args.action === 'edit') {
//       this.periodUpdate = {
//         id: args.data.id ,
//         name: args.data.name ,
//         code: args.data.code ,
//         position: args.data.position ,
//       };
//       this.update();
//     }
//     if (args.requestType === 'delete') {
//       this.delete(args.data[0].id);
//     }
//   }
//   toolbarClick(args) {
//     switch (args.item.id) {
//       case 'grid_excelexport':
//         this.grid.excelExport({ hierarchyExportMode: 'All' });
//         break;
//       default:
//         break;
//     }
//   }
//   actionComplete(args) {
//     if (args.requestType === 'add') {
//       args.form.elements.namedItem('name').focus(); // Set focus to the Target element
//     }
//   }

//   // end life cycle ejs-grid

//   // api

//   loadData() {
//     this.service.getAll().subscribe(data => {
//       this.data = data;
//     });
//   }

//   loadPeriodReportTimeData() {
//     this.periodReportTimeService.getAll().subscribe(data => {
//       this.periodReportTimeData = data;
//     });
//   }
//   delete(id) {
//     this.service.delete(id).subscribe(
//       (res) => {
//         if (res.success === true) {
//           this.alertify.success(MessageConstants.DELETED_OK_MSG);
//           this.loadData();
//         } else {
//            this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
//         }
//       },
//       (err) => this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG)
//     );

//   }
//   create() {
//     this.service.add(this.periodCreate).subscribe(
//       (res) => {
//         if (res.success === true) {
//           this.alertify.success(MessageConstants.CREATED_OK_MSG);
//           this.loadData();
//           this.periodCreate = {} as Period;
//         } else {
//            this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
//         }

//       },
//       (error) => {
//         this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
//       }
//     );
//   }
//   update() {
//     this.service.update(this.periodUpdate).subscribe(
//       (res) => {
//         if (res.success === true) {
//           this.alertify.success(MessageConstants.UPDATED_OK_MSG);
//           this.loadData();
//         } else {
//           this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
//         }
//       },
//       (error) => {
//         this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
//       }
//     );
//   }
//   // end api
//   NO(index) {
//     return (this.grid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
//   }

//   onChangeReportTime(value: Date): void {
//     this.reportTime = this.datePipe.transform(value, "YYYY-MM-dd HH:mm");

//   }
//   showModal(name, value) {
//     this.periodId = +value.id;
//     this.loadPeriodReportTimeData();
//     this.modalReference = this.modalService.open(name, { size: 'lg' });
//   }
//   actionBeginPeriodsGrid(args) {
//     if (args.requestType === 'beginEdit') {
//       const item = args.rowData;
//       this.reportTime = this.datePipe.transform(item?.startTime, "YYYY-MM-dd HH:mm");
//     }
//     if (args.requestType === 'save') {
//       if (args.action === 'add') {
//         this.model = {
//           id: null,
//           periodId: this.periodId,
//           reportTime: this.datePipe.transform(this.reportTime, "YYYY-MM-dd HH:mm"),
//           createdBy:0,
//           modifiedBy: null,
//           createdTime: this.datePipe.transform(new Date(), "YYYY-MM-dd HH:mm"),
//           modifiedTime: null,
//           period: null,
//         }
//         this.createPeriodReportTime();
//       }
//       if (args.action === 'edit') {
//         this.model = {
//           id: 0,
//           periodId: this.periodId,
//           reportTime: this.datePipe.transform(this.reportTime, "YYYY-MM-dd HH:mm"),
//           createdBy:0,
//           modifiedBy: null,
//           createdTime: this.datePipe.transform(new Date(), "YYYY-MM-dd HH:mm"),
//           modifiedTime: null,
//           period: null,
//         }
//         this.updatePeriodReportTime();
//       }
//     }
//     if (args.requestType === 'delete') {
//       this.deletePeriodReportTime(args.data[0].id);
//     }
//   }

//   deletePeriodReportTime(id) {
//     this.periodReportTimeService.delete(id).subscribe(
//       (res) => {
//         if (res.success === true) {
//           this.alertify.success(MessageConstants.DELETED_OK_MSG);
//           this.loadData();
//         } else {
//            this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
//         }
//       },
//       (err) => this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG)
//     );

//   }
//   createPeriodReportTime() {
//     this.periodReportTimeService.add(this.model).subscribe(
//       (res) => {
//         if (res.success === true) {
//           this.alertify.success(MessageConstants.CREATED_OK_MSG);
//           this.periodCreate = {} as Period;
//         } else {
//            this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
//         }

//       },
//       (error) => {
//         this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
//       }
//     );
//   }
//   updatePeriodReportTime() {
//     this.periodReportTimeService.update(this.model).subscribe(
//       (res) => {
//         if (res.success === true) {
//           this.alertify.success(MessageConstants.UPDATED_OK_MSG);
//         } else {
//           this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
//         }
//       },
//       (error) => {
//         this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
//       }
//     );
//   }
// }

