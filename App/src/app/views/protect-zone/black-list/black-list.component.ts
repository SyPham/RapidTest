import { EmployeeService } from './../../../_core/_service/employee.service';
import { BaseComponent } from 'src/app/_core/_component/base.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { BlackListService } from 'src/app/_core/_service/black-list.service';
import { BlackList } from 'src/app/_core/_model/black-list';

@Component({
  selector: 'app-black-list',
  templateUrl: './black-list.component.html',
  styleUrls: ['./black-list.component.scss']
})
export class BlackListComponent extends BaseComponent implements OnInit {
  data: BlackList[] = [];
  modalReference: NgbModalRef;
  fields: object = { text: 'name', value: 'id' };
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  createModel: BlackList;
  updateModel: BlackList;
  setFocus: any;
  locale = localStorage.getItem('lang');
  constructor(
    private serviceEmployee: EmployeeService,
    private service: BlackListService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
  ) { super(); }

  ngOnInit() {
    // this.Permission(this.route);
    this.loadData();
  }
  loadData() {
    this.service.getAll().subscribe(data => {
      this.data = data;
    });
  }
   checkCode(code): boolean {
     let flag = false;
      this.serviceEmployee.checkCode(code).toPromise().then(x=> {
        flag = x;
    });
   return flag;
  }

  initialModel() {
    this.createModel = {
      id: 0,
      code: null,
      fullName: null,
      department: null,
      createdBy: 0,
      createdTime: new Date().toLocaleDateString(),
      modifiedBy:  null,
      modifiedTime: null,
      employeeId: 0,
      deletedTime:  null,
      deletedBy: null,
    };

  }

   actionBegin(args) {
    if (args.requestType === 'add') {
      this.initialModel();
    }
    if (args.requestType === 'beginEdit') {
      const item = args.rowData;
    }
    if (args.requestType === 'save' && args.action === 'add') {
      this.createModel = {
        id: 0,
        code:  args.data.code,
        fullName:  '',
        department: '',
        createdBy: +JSON.parse(localStorage.getItem('user')).id,
        createdTime: new Date().toLocaleDateString(),
        modifiedBy: null,
        modifiedTime: null,
        employeeId: 0,
        deletedBy: null,
        deletedTime: null,
      };

      if (args.data.code === undefined) {
        this.alertify.warning('Please key in a ID! <br> Vui lòng nhập số thẻ!');
        args.cancel = true;
        return;
      }
      this.serviceEmployee.checkCode(args.data.code).toPromise().then(x=> {
        if (x == false) {
          this.alertify.warning('Không tồn tại số thẻ! The ID is not existed!');
          args.cancel = true;
          return;
        } else {
          this.create()
        }
    } , () => {
      this.alertify.warning('Không tồn tại số thẻ! The ID is not existed!');
      args.cancel = true;
      return;
    });
    }
    if (args.requestType === 'save' && args.action === 'edit') {
      this.updateModel = {
        id: args.data.id,
        code:  args.data.code,
        fullName:  '',
        department: '',
        createdBy: args.data.createdBy,
        createdTime: args.data.createdTime,
        modifiedBy: +JSON.parse(localStorage.getItem('user')).id,
        modifiedTime: new Date().toLocaleDateString(),
        employeeId: args.data.employeeId,
        deletedBy: args.data.deletedBy,
        deletedTime: args.data.deletedTime,
      };
      this.serviceEmployee.checkCode(args.data.code).toPromise().then(x=> {
        if (x == false) {
          this.alertify.warning('Không tồn tại số thẻ! The ID is not existed!');
          this.grid.refresh();
          args.cancel = true;
          return;
        } else {
          this.update();
        }
    } , () => {
      this.alertify.warning('Không tồn tại số thẻ! The ID is not existed!');
      args.cancel = true;
      return;
    });
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

  // end life cycle ejs-grid

  // api

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
    this.service.add(this.createModel).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(MessageConstants.CREATED_OK_MSG);
          this.loadData();
          this.createModel = {} as BlackList;
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
    this.service.update(this.updateModel).subscribe(
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

}
