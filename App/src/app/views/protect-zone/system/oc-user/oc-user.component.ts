import { filter } from 'rxjs/operators'
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { AlertifyService } from 'src/app/_core/_service/alertify.service'
import { AccountService } from 'src/app/_core/_service/account.service'
import { Account2Service } from 'src/app/_core/_service/account2.service'
import { BaseComponent } from 'src/app/_core/_component/base.component'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { MessageConstants } from 'src/app/_core/_constants/system'

import { OcService } from './../../../../_core/_service/oc.service'
import { Account } from 'src/app/_core/_model/account'

@Component({
  selector: 'app-oc-user',
  templateUrl: './oc-user.component.html',
  styleUrls: ['./oc-user.component.scss']
})
export class OcUserComponent extends BaseComponent implements OnInit {

  toolbarBuilding: object;
  toolbarUser: object;
  data: any;
  OCId: number;
  userData: any;
  buildingUserData: any;
  ocName: number
  OcUserData: any
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  toolbarOptions = ['Add', 'Delete', 'Cancel', 'Search'];
  accountIdList: any = [];
  accountData: Account[];
  fields: object = { text: 'fullName', value: 'id' };
  accountList: any = [];
  @ViewChild('addUserOc') public addUserOc: TemplateRef<any>;
  model = {
    accountId: 0,
    ocId: 0,
    ocName: null,
    accountIdList: this.accountIdList
  };
  modalReference: NgbModalRef;
  constructor(
    private ocService: OcService,
    private alertify: AlertifyService,
    public modalService: NgbModal,
    private accountService: Account2Service,
  ) {super(); }

  ngOnInit() {
    this.toolbarUser = ['Search'];
  }

  actionBegin(args) {

    if (args.requestType === 'delete') {
      console.log(args)
      const obj = {
        accountId: args.data[0].id,
        ocId: this.OCId,
        ocName: this.ocName
      }
      console.log(obj)
      this.removeBuildingUser(obj);
   }
  }
  openModal(item) {
    this.getAllUsers();
    this.modalReference = this.modalService.open(this.addUserOc, { size: 'lg' });
  }

  toolbarClick(args: any): void {
    switch (args.item.id) {
      case 'grid_add':
        args.cancel = true;
        this.openModal(this.addUserOc);
        break;
      case 'exportExcel':
        break;
      default:
        break;
    }
  }

  create() {
    this.model = {
      accountId: 0,
      ocId: this.OCId,
      ocName: this.ocName,
      accountIdList: this.accountIdList
    };
    this.ocService.mapRangeUserOC(this.model).subscribe((res: any) => {
      if (res.status) {
        this.alertify.success(MessageConstants.CREATED_OK_MSG);
        this.getUserByOcID(this.OCId);
        this.accountIdList = [];
        this.model = {
          accountId: 0,
          ocId: 0,
          ocName: null,
          accountIdList: this.accountIdList
        };
        this.modalService.dismissAll();
      } else {
        this.alertify.warning(res.message);
      }
    })

  }

  removing(args) {
    const filteredItems = this.accountIdList.filter(item => item !== args.itemData.id);
    this.accountIdList = filteredItems;
    this.accountList = this.accountList.filter(item => item.id !== args.itemData.id);
  }

  onSelect(args) {
    const data = args.itemData;
    this.accountIdList.push(data.id);
    this.accountList.push({ objectiveId: 0 , id: data.id, username: data.username});
  }

  created() {
    this.getBuildingsAsTreeView();
  }

  createdUsers() {
  }

  rowSelected(args) {
    const data = args.data.entity || args.data;
    this.OCId = Number(data.id);
    this.ocName = data.name;
    if (args.isInteracted) {
      this.getUserByOcID(this.OCId);
    }
  }

  getBuildingsAsTreeView() {
    this.ocService.getOCs().subscribe(res => {
      this.data = res;
    });
  }

  mappingUserWithBuilding(obj) {
    this.ocService.mapUserOC(obj).subscribe((res: any) => {
      if (res.status) {
        this.alertify.success(res.message);
        this.getUserByOcID(this.OCId);
      } else {
        this.alertify.warning(res.message);
        this.getUserByOcID(this.OCId);
      }
    });
  }

  removeBuildingUser(obj) {
    this.ocService.removeUserOC(obj).subscribe((res: any) => {
      if (res.status) {
        this.alertify.success(res.message);
        this.getUserByOcID(this.OCId);
      } else {
        this.alertify.warning(res.message);
        this.getUserByOcID(this.OCId);

      }
    });
  }

  getAllUsers() {
    this.accountService.getAll().subscribe((res: any) => {
      const data = res.map((i: any) => {
        return {
          id: i.id,
          fullName: i.fullName,
          email: i.email,
          status: this.checkStatus(i.id)
        };
      });
      this.userData = data.filter(x => x.status);
      this.accountData = res ;
    });
  }

  getUserByOcID(OCId) {
    this.ocService.GetUserByOcID(OCId).subscribe(res => {
      this.OcUserData = res || [];
      this.getAllUsers();
    });
  }

  checkStatus(accountId) {
    this.OcUserData = this.OcUserData || [];
    const item = this.OcUserData.filter(i => {
      return i.accountId === accountId && i.ocId === this.OCId;
    });
    if (item.length <= 0) {
      return false;
    } else {
      return true;
    }

  }

  onChangeMap(args, data) {
    if (this.OCId > 0) {
      if (args.checked) {
        const obj = {
          accountId: data.id,
          ocId: this.OCId,
          ocName: this.ocName
        };
        this.mappingUserWithBuilding(obj);
      } else {
        const obj = {
          accountId: data.id,
          ocId: this.OCId,
          ocName: this.ocName
        }
        this.removeBuildingUser(obj);
      }
    } else {
      this.alertify.warning('Please select a building!');
    }
  }

}
