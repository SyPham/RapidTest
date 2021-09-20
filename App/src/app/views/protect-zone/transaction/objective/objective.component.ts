import { BaseComponent } from 'src/app/_core/_component/base.component'
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { AlertifyService } from 'src/app/_core/_service/alertify.service'
import { GridComponent } from '@syncfusion/ej2-angular-grids'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { ActivatedRoute } from '@angular/router'
import { MessageConstants } from 'src/app/_core/_constants/system'
import { PeriodService } from 'src/app/_core/_service/period.service'
import { AccountGroup } from 'src/app/_core/_model/account.group'
import { DatePipe } from '@angular/common'
import { PeriodReportTimeService } from 'src/app/_core/_service/period.report.time.service'
import { Objective } from 'src/app/_core/_model/objective'
import { Account } from 'src/app/_core/_model/account'
import { Account2Service } from 'src/app/_core/_service/account2.service'

import { ObjectiveRequest } from './../../../../_core/_model/objective'
import { ObjectiveService } from './../../../../_core/_service/objective.service'
import { PeriodReportTime } from './../../../../_core/_model/period.report.time'
import { AccountGroupService } from './../../../../_core/_service/account.group.service'
import { Period } from '../../../../_core/_model/period'

@Component({
  selector: 'app-objective',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss'],
  providers: [DatePipe]
})
export class ObjectiveComponent extends BaseComponent implements OnInit {
  data: Objective[] = [];
  periodReportTimeData: PeriodReportTime[] = [];
  password = '';
  @ViewChild('addNewModal') public addNewModal: TemplateRef<any>;
  modalReference: NgbModalRef;
  fields: object = { text: 'fullName', value: 'id' };
  filterSettings = { type: 'Excel' };
  // toolbarOptions = ['Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;

  setFocus: any;
  locale = localStorage.getItem('lang');
  accountGroupData: AccountGroup[];
  accountGroupId: any;
  reportTime: any;
  periodData: Period[];
  accountIds: number[];
  accountId: number;
  accountData: Account[];
  accountIdList: any = [];
  accountList: any = [];
  topic: string;
  model: ObjectiveRequest = {
    id: 0,
    topic: "",
    status: false,
    date: new Date().toLocaleDateString(),
    accountIdList: this.accountIdList
  };
  toolbarOptions = ['Add', 'Search'];
  constructor(
    private service: ObjectiveService,
    private periodService: PeriodService,
    private accountService: Account2Service,
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
    this.loadAccountData();
    this.loadAccountGroupData();
  }
  // life cycle ejs-grid

  onDoubleClick(args: any): void {
    console.log(args);
    const data = args.rowData;
    this.model = {
      id: data.id,
      topic: data.topic,
      status: data.status,
      date: data.date,
      accountIdList: data.accountIdList
    };
    this.accountIdList  = data.accountIdList;
    this.openModal(this.addNewModal);
    this.setFocus = args.column; // Get the column from Double click event
  }
  actionBegin(args) {
    if (args.requestType === 'beginEdit') {
      const item = args.rowData;
      this.accountGroupId = item.accountGroupId;
      this.topic = item.topic;
      args.cancel = true;
    }
    if (args.requestType === 'save' && args.action === 'add') {


      this.create();
    }
    if (args.requestType === 'save' && args.action === 'edit') {
      this.model = {
        id: args.data.id,
        topic: args.data.topic,
        status: false,
        date: args.data.date,
        accountIdList: this.accountIdList
      };

      this.update();
    }
    if (args.requestType === 'delete') {
      this.delete(args.data[0].id);
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
    this.service.getAllKPIObjectiveByAccountId().subscribe(data => {
      this.data = data;
    });
  }
  loadAccountData() {
    this.accountService.getAll().subscribe(data => {
      this.accountData = data.filter(x=> x.id !== +JSON.parse(localStorage.getItem('user')).id);
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
    this.alertify.confirm(
      "Delete",
      'Are you sure you want to delete the objective?',
      () => {
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
    );


  }
  create() {
    this.model = {
      id: 0,
      topic: this.topic,
      status: false,
      date: new Date().toLocaleDateString(),
      accountIdList: this.accountIdList
    };
    this.service.post(this.model).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(MessageConstants.CREATED_OK_MSG);
          this.loadData();
          this.topic = '';
          this.accountIdList = [];
          this.model = {
            id: 0,
            topic: "",
            status: false,
            date: new Date().toLocaleDateString(),
            accountIdList: this.accountIdList
          };
          this.modalService.dismissAll();
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
    this.model.topic = this.topic;
    this.model.accountIdList = this.accountIdList;
    this.service.put(this.model).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(MessageConstants.UPDATED_OK_MSG);
          this.loadData();
          this.modalService.dismissAll();
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

  removing(args) {
    const filteredItems = this.accountIdList.filter(item => item !== args.itemData.id);
    this.accountIdList = filteredItems;
    this.accountList = this.accountList.filter(item => item.id !== args.itemData.id);
    console.log(this.accountList);
    console.log(this.accountIdList);
  }
  onSelect(args) {
    const data = args.itemData;
    this.accountIdList.push(data.id);
    this.accountList.push({ objectiveId: 0 , id: data.id, username: data.username});
    console.log(this.accountList);
    console.log(this.accountIdList);
  }
  toolbarClick(args: any): void {
    switch (args.item.id) {
      case 'grid_add':
        args.cancel = true;
        this.openModal(this.addNewModal);
        break;
      case 'exportExcel':
        break;
      default:
        break;
    }
  }
  openModal(item) {
    this.modalReference = this.modalService.open(this.addNewModal, { size: 'xl' });
  }

}

