import { DatePipe } from '@angular/common';
import { ToDoList } from './../../../../../_core/_model/todolistv2';
import { Todolistv2Service } from './../../../../../_core/_service/todolistv2.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Objective, ObjectiveRequest } from 'src/app/_core/_model/objective';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ToDoListLevel } from 'src/app/_core/enum/system';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
  providers: [DatePipe]
})
export class ActionComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;
  @Input() data: any;
  gridData: object;
  @Input() isReject: any;
  toolbarOptions = ['Add', 'Delete', 'Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  editSettings = { showDeleteConfirmDialog: false, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
  model: ToDoList;
  title: string;
  targetModel: ToDoList;
  objectiveModel: ToDoList;
  deadline: any;
  target: string;
  objective: string;
  constructor(
    public activeModal: NgbActiveModal,
    public service: Todolistv2Service,
    private alertify: AlertifyService,
    private todolistService: Todolistv2Service,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.targetModel = {
      id: 0,
      deadline: '',
      action:  '',
      remark:  '',
      parentId: 0,
      objectiveId: this.data.id,
      level: ToDoListLevel.Target,
      createdBy: +JSON.parse(localStorage.getItem('user')).id,
      modifiedBy: null,
      createdTime: new Date().toLocaleDateString(),
      modifiedTime: null,
    };
    this.objectiveModel = {
      id: 0,
      deadline: '',
      action:  '',
      remark:  '',
      parentId: 0,
      objectiveId: this.data.id,
      level: ToDoListLevel.Objective,
      createdBy: +JSON.parse(localStorage.getItem('user')).id,
      modifiedBy: null,
      createdTime: new Date().toLocaleDateString(),
      modifiedTime: null,
    };
    this.loadData();
  }
  loadData() {
    this.service.getAllByObjectiveId(this.data.id).subscribe(data => {
      this.gridData = data.filter(x=> x.level == 3);
      if (data.length > 0) {
        const target = data.filter(x=> x.level == 2)[0];
        this.targetModel = {
          id: target?.id,
          deadline: target?.deadline,
          action:  target?.action,
          remark:  target?.remark,
          parentId: target?.parentId,
          objectiveId: target?.objectiveId,
          level: target?.level,
          createdBy: target?.createdBy,
          modifiedBy: target?.modifiedBy,
          createdTime: target?.createdTime,
          modifiedTime: target?.modifiedTime,
        };
        this.target = this.targetModel?.action;
        this.deadline = this.targetModel?.deadline;

        const objective = data.filter(x=> x.level == 1)[0];
        this.objectiveModel = {
          id: objective?.id,
          deadline: objective?.deadline,
          action:  objective?.action,
          remark:  objective?.remark,
          parentId: objective?.parentId,
          objectiveId: objective?.objectiveId,
          level: objective?.level,
          createdBy: objective?.createdBy,
          modifiedBy: objective?.modifiedBy,
          createdTime: objective?.createdTime,
          modifiedTime: objective?.modifiedTime,
        };
        this.objective = this.objectiveModel?.action;
      }

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
  actionBegin(args) {
    if (args.requestType === 'delete') {
      if (args.data[0].id > 0) {
        this.delete(args.data[0].id);
      }
    }
  }
  create() {
    this.model = {
      id: 0,
      deadline: '',
      action:  '',
      remark:  '',
      parentId: 0,
      objectiveId: this.data.id,
      level: 0,
      createdBy: +JSON.parse(localStorage.getItem('user')).id,
      modifiedBy: null,
      createdTime: new Date().toLocaleDateString(),
      modifiedTime: null,
    };
    this.service.add(this.model).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(MessageConstants.CREATED_OK_MSG);
          this.loadData();
          this.model = {} as ToDoList;
        } else {
          this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
        }

      },
      (error) => {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    );
  }
  isNullOrUndefined(value) {
    if (value === null || value === undefined) {
      return true;
    }
    return false;
  }
  createRange() {
    const data = [];
    const gridData = this.grid.currentViewData as ToDoList[] || [];
    console.log(this.target);
    console.log(this.objective);
    if (gridData.length === 0 || this.isNullOrUndefined(this.target) || this.isNullOrUndefined(this.objective)|| this.isNullOrUndefined(this.deadline)) {
      this.alertify.warning('Not yet complete. Can not submit!', true);
      return;
    }
    this.targetModel.action = this.target;
    this.targetModel.deadline = this.datePipe.transform(this.deadline, "yyyy-MM-dd HH:mm:ss");
    this.objectiveModel.action = this.objective;
    data.push(this.targetModel)
    data.push(this.objectiveModel)
    for (const item of gridData) {
      const model = {
        id: item.id,
        deadline: null,
        action:  item.action,
        remark:  '',
        level: ToDoListLevel.Action,
        parentId: null,
        objectiveId: this.data.id,
        createdBy: +JSON.parse(localStorage.getItem('user')).id,
        modifiedBy: null,
        createdTime: new Date().toLocaleDateString(),
        modifiedTime: null,
      } as ToDoList;
      data.push(model);
    }
    const disableReject = this.todolistService.disableReject([this.data.todolistId]);
    const addRange = this.service.addRange(data);
    const sources = [addRange];
    if (this.isReject) {
      sources.push(disableReject);
    }
    forkJoin(sources).subscribe(response => {
      console.log(response)
      const arr = response.map(x=> x.success);
      const checker = arr => arr.every(Boolean);
      if (checker) {
        this.alertify.success(MessageConstants.CREATED_OK_MSG);
        this.loadData();
        this.activeModal.close();
        this.todolistService.changeMessage(true);
      } else {
        this.alertify.warning('Not yet complete. Can not submit! 尚未完成，無法提交', true);
      }
    },
    (error) => {
      this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
    })
  }
  update() {

    this.service.update(this.model).subscribe(
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
  finish() {
    this.createRange();
  }
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
  }
}
