import { BaseComponent } from 'src/app/_core/_component/base.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { GridComponent, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { TestKind } from 'src/app/_core/_model/test-kind';
import { TestKindService } from 'src/app/_core/_service/test.kind.service';

@Component({
  selector: 'app-test-kind',
  templateUrl: './test-kind.component.html',
  styleUrls: ['./test-kind.component.scss']
})
export class TestKindComponent extends BaseComponent implements OnInit {
  data: TestKind[] = [];
  password = '';
  modalReference: NgbModalRef;
  // toolbarOptions = ['Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  createModel: TestKind;
  updateModel: TestKind;
  setFocus: any;
  locale = localStorage.getItem('lang');
  constructor(
    private service: TestKindService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
  ) { super(); }

  ngOnInit() {
    // this.Permission(this.route);
    this.loadData();
  }
  // life cycle ejs-grid

  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }
  toggleIsDefault(id, callBack): void {
    this.service.toggleIsDefault(id).subscribe(
      (res) => {
        callBack(res);
      },
      (err) => this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG)
    );
  }
  onChange(args, data) {
    console.log(args);
    data.isDefault = args.checked;
    this.toggleIsDefault(data.id, (res)=> {
      if (res.success === true) {
        const message = res.message;
        const item = res.data;
        const dataSource = this.grid.dataSource as TestKind[];
        const index = dataSource.findIndex(x=> x.id == item.id);
        dataSource[index].isDefault = args.checked;
        this.grid.refresh();
        this.alertify.success(message);
      } else {
         this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    })
  }
  hasDefault() {
    let check = false;
    for (const item of this.data) {
      if (item.isDefault) {
        check = true;
        break;
      }
    }
    return check;
  }
  actionBegin(args) {
    if (args.requestType === 'save' && args.action === 'add') {
      this.createModel = {
        id: 0,
        name: args.data.name ,
        isDefault: args.data.isDefault ,
        createdBy: +JSON.parse(localStorage.getItem('user')).id ,
        modifiedBy: null,
        createdTime: new Date().toLocaleDateString(),
        modifiedTime:  null
      };

      if (args.data.name === undefined) {
        this.alertify.error('Please key in a name! <br> Vui lòng nhập tên nhóm tài khoản!');
        args.cancel = true;
        return;
      }

      this.create();
    }
    if (args.requestType === 'save' && args.action === 'edit') {
      this.updateModel = {
        id: args.data.id ,
        name: args.data.name ,
        isDefault: args.data.isDefault ,
        createdBy: args.data.createdBy ,
        modifiedBy: +JSON.parse(localStorage.getItem('user')).id ,
        createdTime: args.data.createdTime ,
        modifiedTime:  new Date().toLocaleDateString(),
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
          this.createModel = {} as TestKind;
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
