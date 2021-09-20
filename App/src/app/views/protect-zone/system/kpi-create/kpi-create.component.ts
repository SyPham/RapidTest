import { KpinewService } from './../../../../_core/_service/kpinew.service';
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
  selector: 'app-kpi-create',
  templateUrl: './kpi-create.component.html',
  styleUrls: ['./kpi-create.component.scss']
})
export class KpiCreateComponent extends BaseComponent implements OnInit {
  toolbarBuilding: object;
  toolbarUser: object;
  data: any;
  OCId: number = 0;
  userData: any;
  buildingUserData: any;
  ocName: number
  OcUserData: any
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  toolbarOptions = ['Add','Update',  'Delete', 'Cancel', 'Search'];
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
  picFields: object = { text: 'fullName', value: 'id' };
  typeFields: object = { text: 'name', value: 'id' };
  policyFields: object = { text: 'name', value: 'policyId' };
  managers: any[] = [];
  managerId: number;
  modalReference: NgbModalRef;
  policyData: Object;
  kpiData: Object;
  policyId: number = 0;
  picId: number = 0;
  typeId: number = 0;
  typeData: Object;
  constructor(
    private ocService: OcService,
    private kpiNewService: KpinewService,
    private alertify: AlertifyService,
    public modalService: NgbModal,
    private accountService: Account2Service,
  ) {super(); }

  ngOnInit() {
    this.toolbarUser = ['Search'];
  }
  rowSelected(args) {
    const data = args.data.entity || args.data;
    this.OCId = Number(data.id);
    this.ocName = data.name;
    if (args.isInteracted) {
      this.getAllUsers();
      this.getKPIByOc(this.OCId);
      this.getPolicyByOc(this.OCId)
      this.getAllType();
    }
  }
  getPolicyByOc(id) {
    this.kpiNewService.getPolicyByOcID(id).subscribe(res => {
      console.log('getPolicyByOc', res);
      this.policyData = res
    })
  }
  getKPIByOc(id) {
    this.kpiNewService.getKPIByOcID(id).subscribe(res => {
      console.log('getKPIByOc', res);
      this.kpiData = res
    })
  }
  getAllType() {
    this.kpiNewService.getAllType().subscribe(res => {
      console.log('getAllType', res);
      this.typeData = res
    })
  }
  initialModel() {
  }
  updateModel(data) {
    this.policyId = data.policyId
    this.typeId = data.typeId
    this.picId = data.pic
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
        OcId: this.OCId,
        PolicyId: this.policyId,
        TypeId: this.typeId,
        Pic: this.picId
      }
      if (args.data.name === undefined) {
        this.alertify.error('Please key in policy name! <br> Vui lòng nhập Policy!');
        args.cancel = true;
        return;
      }
      if (this.policyId === 0) {
        this.alertify.error('Please select Policy !');
        args.cancel = true;
        return;
      }
      if (this.typeId === 0) {
        this.alertify.error('Please select a Type! ');
        args.cancel = true;
        return;
      }
      if (this.picId === 0) {
        this.alertify.error('Please select a PIC! ');
        args.cancel = true;
        return;
      }
      this.create(model);

    }
    if (args.requestType === 'save' && args.action === 'edit') {
      const model = {
        Id: args.data.id,
        Name: args.data.name,
        OcId: this.OCId,
        PolicyId: this.policyId,
        TypeId: this.typeId,
        Pic: this.picId
      }
      this.update(model);
    }
    if (args.requestType === 'delete') {
      this.delete(args.data[0].id);
    }
  }
  update(model) {
    this.kpiNewService.update(model).subscribe(res => {
      if(res) {
        this.alertify.success(MessageConstants.CREATED_OK_MSG);
        this.getKPIByOc(this.OCId)
        this.refreshData()
      }else {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    })
  }
  delete(id) {
    this.kpiNewService.delete(id).subscribe(res => {
      if(res) {
        this.alertify.success(MessageConstants.CREATED_OK_MSG);
        this.getKPIByOc(this.OCId)
      }else {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    })
  }
  openModal(item) {
    this.getAllUsers();
    this.modalReference = this.modalService.open(this.addUserOc, { size: 'lg' });
  }

  toolbarClick(args: any): void {
    switch (args.item.id) {
      case 'grid_add':
        if (this.OCId === 0) {
          this.alertify.error('Please select oc first!');
          args.cancel = true;
          return;
        }
        // args.cancel = true;
        // this.openModal(this.addUserOc);
        break;
      case 'exportExcel':
        break;
      default:
        break;
    }
  }
  refreshData() {
    this.policyId = 0
    this.picId = 0
    this.typeId = 0
  }
  create(model) {
    this.kpiNewService.add(model).subscribe(res => {
      if(res) {
        this.alertify.success(MessageConstants.CREATED_OK_MSG);
        this.getKPIByOc(this.OCId)
        this.refreshData()
      }else {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    })
    // this.model = {
    //   accountId: 0,
    //   ocId: this.OCId,
    //   ocName: this.ocName,
    //   accountIdList: this.accountIdList
    // };
    // this.ocService.mapRangeUserOC(this.model).subscribe((res: any) => {
    //   if (res.status) {
    //     this.alertify.success(MessageConstants.CREATED_OK_MSG);
    //     this.getUserByOcID(this.OCId);
    //     this.accountIdList = [];
    //     this.model = {
    //       accountId: 0,
    //       ocId: 0,
    //       ocName: null,
    //       accountIdList: this.accountIdList
    //     };
    //     this.modalService.dismissAll();
    //   } else {
    //     this.alertify.warning(res.message);
    //   }
    // })

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
