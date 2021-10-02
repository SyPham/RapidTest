import { BaseComponent } from 'src/app/_core/_component/base.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { GridComponent, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { Setting, UpdateDescriptionRequest } from 'src/app/_core/_model/setting';
import { SettingService } from 'src/app/_core/_service/setting.service';
@Component({
  selector: 'app-check-out-setting',
  templateUrl: './check-out-setting.component.html',
  styleUrls: ['./check-out-setting.component.scss']
})
export class CheckOutSettingComponent extends BaseComponent implements OnInit {
  data: Setting[] = [];
  password = '';
  modalReference: NgbModalRef;
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  createModel: Setting;
  updateModel: Setting;
  updateDescriptionModel: UpdateDescriptionRequest;
  setFocus: any;
  description: any;
  id: any;
  locale = localStorage.getItem('lang');
  constructor(
    private service: SettingService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
  ) { super(); }

  ngOnInit() {
    this.loadData();
  }

  actionBegin(args) {
    if (args.requestType === 'save' && args.action === 'add') {
      this.createModel = {
        id: 0,
        day: 0 ,
        mins: args.data.mins ,
        createdBy: +JSON.parse(localStorage.getItem('user')).id ,
        modifiedBy: null,
        description: null,
        createdTime: new Date().toLocaleDateString(),
        modifiedTime:  null,
        settingType: 'CHECK_OUT'
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
        day: 0 ,
        mins: args.data.mins ,
        createdBy: args.data.createdBy ,
        description: args.data.description ,
        modifiedBy: +JSON.parse(localStorage.getItem('user')).id ,
        createdTime: args.data.createdTime ,
        settingType: args.data.settingType ,
        modifiedTime:  new Date().toLocaleDateString(),
      };
      this.update();
    }
    if (args.requestType === 'delete') {
      this.delete(args.data[0].id);
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
      this.data = data.filter(x=> x.settingType == 'CHECK_OUT') || [];
      this.id = this.data[0].id;
      this.description = this.data[0].description;
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
          this.createModel = {} as Setting;
        } else {
           this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
        }

      },
      (error) => {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    );
  }
  onKeyup() {
    this.updateDescription();
  }
  updateDescription() {
    this.updateDescriptionModel = {
      id: this.id,
      description: this.description
    };
    this.service.updateDescription(this.updateDescriptionModel).subscribe(
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
