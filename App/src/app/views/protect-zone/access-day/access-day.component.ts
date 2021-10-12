import { DatePipe } from '@angular/common';
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
  selector: 'app-access-day',
  templateUrl: './access-day.component.html',
  styleUrls: ['./access-day.component.scss']
})
export class AccessDayComponent extends BaseComponent implements OnInit {
  data: Setting[] = [];
  password = '';
  modalReference: NgbModalRef;
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  createModel: Setting;
  updateModel: Setting;
  updateDescriptionModel: UpdateDescriptionRequest;
  description: string = '';
  setFocus: any;
  locale = localStorage.getItem('lang');
  id: number;
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
        day: args.data.day ,
        isDefault: false ,
        createdBy: +JSON.parse(localStorage.getItem('user')).id ,
        modifiedBy: null,
        description: null,
        dayOfWeek: args.data.dayOfWeek ,
        hours: args.data.hours ,
        name: null ,
        createdTime: new Date().toLocaleDateString(),
        modifiedTime:  null,
        mins: 0 ,
        settingType: 'ACCESS_DAY_2',
        parentId: 4
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
        day: args.data.day ,
        mins: 0 ,
        name: null ,
        isDefault: args.data.isDefault ,
        dayOfWeek: args.data.dayOfWeek ,
        hours: args.data.hours ,
        createdBy: args.data.createdBy ,
        description: args.data.description ,
        modifiedBy: +JSON.parse(localStorage.getItem('user')).id ,
        createdTime: args.data.createdTime ,
        settingType: args.data.settingType ,
        modifiedTime:  new Date().toLocaleDateString(),
        parentId: args.data.parentId
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
      this.data = data.filter(x=> x.settingType == 'ACCESS_DAY_2') || [];
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
  // end api
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
  }

}
