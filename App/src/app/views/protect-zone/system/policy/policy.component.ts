import { OcPolicyService } from './../../../../_core/_service/OcPolicy.service';
import { BaseComponent } from 'src/app/_core/_component/base.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { EditService, ToolbarService, PageService, GridComponent } from '@syncfusion/ej2-angular-grids';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Account2Service } from 'src/app/_core/_service/account2.service';
import { Account } from 'src/app/_core/_model/account';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { AccountGroupService } from 'src/app/_core/_service/account.group.service';
import { AccountGroup } from 'src/app/_core/_model/account.group';
import { OcService } from 'src/app/_core/_service/oc.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
  providers: [ToolbarService, EditService, PageService]
})
export class PolicyComponent extends BaseComponent implements OnInit {

  data: Account[] = [];
  password = '';
  modalReference: NgbModalRef;
  fields: object = { text: 'name', value: 'id' };
  leaderFields: object = { text: 'fullName', value: 'id' };
  managerFields: object = { text: 'fullName', value: 'id' };
  // toolbarOptions = ['Search'];
  passwordFake = `aRlG8BBHDYjrood3UqjzRl3FubHFI99nEPCahGtZl9jvkexwlJ`;
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  accountCreate: Account;
  accountUpdate: Account;
  setFocus: any;
  locale = localStorage.getItem('lang');
  accountGroupData: AccountGroup[];
  accountGroupItem: any;
  leaders: any[] = [];
  managers: any[] = [];
  leaderId: number;
  managerId: number;
  accounts: any[];
  oclv3Data: any [];
  policyData: Object;
  constructor(
    private service: Account2Service,
    private accountGroupService: AccountGroupService,
    public modalService: NgbModal,
    private ocService: OcService,
    private ocPolicyService: OcPolicyService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
  ) { super(); }

  ngOnInit() {
    // this.Permission(this.route);
    // this.loadData();
    // this.getAccounts();
    // this.loadAccountGroupData();
    this.getAllOcLv3();
    this.getAllPolicy();

  }
  getAllPolicy(){
    this.ocPolicyService.getAllPolicy().subscribe(res => {
      this.policyData = res ;
    })
  }
  getAllOcLv3() {
    this.ocService.getAllLv3().subscribe((res: any) => {
      this.oclv3Data = res
    })
  }
  // life cycle ejs-grid
  createdManager($event, data) {
    this.managers = this.accounts;
    this.managers = this.managers.filter(x=> x.id !== data.id);
  }
  createdLeader($event, data) {
    this.leaders = this.accounts.filter(x=> x.isLeader);
    this.leaders = this.leaders.filter(x=> x.id !== data.id);
  }
  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }
  initialModel() {
    this.accountGroupItem = [];
  }
  updateModel(data) {
    this.accountGroupItem = data.factory;
  }
  actionBegin(args) {
    if (args.requestType === 'add') {
      this.initialModel();
    }
    if (args.requestType === 'beginEdit') {
      const item = args.rowData;
      this.updateModel(item);
    }
    if (args.requestType === 'save' && args.action === 'add') {

      const model = {
        Name: args.data.name,
        OcIdList: this.accountGroupItem
      }
      if (args.data.name === undefined) {
        this.alertify.error('Please key in policy name! <br> Vui lòng nhập Policy!');
        args.cancel = true;
        return;
      }

      this.create(model);

    }
    if (args.requestType === 'save' && args.action === 'edit') {
      const model = {
        ID: args.data.id,
        Name: args.data.name,
        OcIdList: this.accountGroupItem
      }
      this.update(model);
    }
    if (args.requestType === 'delete') {
      this.delete(args.data[0].id);
    }
  }
 deleteOption(id) {
  this.ocPolicyService.deletePolicy(id).subscribe(res => {
    if(res) {
      this.alertify.success(MessageConstants.CREATED_OK_MSG);
      this.getAllPolicy()
      this.accountGroupItem = []
    } else {
      this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
    }
  })
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

  lock(id): void {
    this.service.lock(id).subscribe(
      (res) => {
        if (res.success === true) {
          const message = res.message;
          this.alertify.success(message);
          this.loadData();
        } else {
           this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
        }
      },
      (err) => this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG)
    );
  }

  loadData() {
    this.service.getAll().subscribe(data => {
      this.data = data;
    });
  }
  getAccounts() {
    this.service.getAccounts().subscribe(data => {
      this.accounts = data;
      this.leaders = data.filter(x=> x.isLeader);
      this.managers = data;
    });
  }
  loadAccountGroupData() {
    this.accountGroupService.getAll().subscribe(data => {
      this.accountGroupData = data;
    });
  }
  delete(id) {
    this.ocPolicyService.deletePolicy(id).subscribe(res => {
      if(res) {
        this.alertify.success(MessageConstants.CREATED_OK_MSG);
        this.getAllPolicy()
        this.accountGroupItem = []
      } else {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    })
  }
  create(model) {
    this.ocPolicyService.addPolicy(model).subscribe(res => {
      if(res) {
        this.alertify.success(MessageConstants.CREATED_OK_MSG);
        this.getAllPolicy()
        this.accountGroupItem = []
      } else {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    })
  }
  update(model) {
    this.ocPolicyService.updatePolicy(model).subscribe(res => {
      if(res) {
        this.alertify.success(MessageConstants.CREATED_OK_MSG);
        this.getAllPolicy()
        this.accountGroupItem = []
      } else {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    })
  }
  // end api
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
  }


}
