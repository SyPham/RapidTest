import { ObjectiveService } from 'src/app/_core/_service/objective.service';
import { SmartScoreService } from './../../../../../_core/_service/smart-score.service';
import { filter } from 'rxjs/operators';
import { UtilitiesService } from '../../../../../_core/_service/utilities.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Objective } from 'src/app/_core/_model/objective';
import { ToDoList, ToDoListL1L2, ToDoListOfQuarter } from 'src/app/_core/_model/todolistv2';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { Todolistv2Service } from 'src/app/_core/_service/todolistv2.service';

import { QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { EmitType } from '@syncfusion/ej2-base';
import { KPIScoreService } from 'src/app/_core/_service/kpi-score.service';
import { KPIScore } from 'src/app/_core/_model/kpi-score';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { KPIService } from 'src/app/_core/_service/kpi.service';
import { KPI } from 'src/app/_core/_model/kpi';
import { Comment } from 'src/app/_core/_model/commentv2';
import { Commentv2Service } from 'src/app/_core/_service/commentv2.service';
import { forkJoin } from 'rxjs';
import { CommentType, PeriodType, SystemScoreType } from 'src/app/_core/enum/system';
import { SmartScore } from 'src/app/_core/_model/smart-score';
@Component({
  selector: 'app-kpi-score-ghr',
  templateUrl: './kpi-score-ghr.component.html',
  styleUrls: ['./kpi-score-ghr.component.scss']
})
export class KpiScoreGHRComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;
  @Input() data: any;
  @Input() periodTypeCode: PeriodType;
  @Input() scoreType: SystemScoreType;
  @Input() currentTime: any;

  gridData: object;
  toolbarOptions = ['Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  editSettings = { showDeleteConfirmDialog: false, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
  model: ToDoList;
  kpiScoreModel: KPIScore;
  kpiScoreData: KPIScore;
  point: number;
  kpiData: KPI[];
  fields: object = { text: 'point', value: 'point' };
  filterSettings = { type: 'Excel' };
  content = '';
  commentModel: Comment;
  quarterlySettingsData = [];
  columns = [];
  objectiveIds: any = [];
  smartScoreData: SmartScore[];
  constructor(
    public activeModal: NgbActiveModal,
    public service: Todolistv2Service,
    public kpiScoreService: KPIScoreService,
    public kpiService: KPIService,
    public objectiveService: ObjectiveService,
    public smartScoreService: SmartScoreService,
    public commentService: Commentv2Service,
    private alertify: AlertifyService,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnInit(): void {
    this.kpiScoreModel = {
      id: 0,
      periodTypeId: this.data.periodTypeId,
      period: this.data.period,
      point: this.point,
      scoreBy: +JSON.parse(localStorage.getItem('user')).id,
      modifiedTime: null,
      createdTime: new Date().toDateString(),
      accountId: this.data.id,
      scoreType: this.scoreType

    }
    this.commentModel = {
      id: 0,
      content: this.content,
      createdBy: +JSON.parse(localStorage.getItem('user')).id,
      accountId: this.data.id,
      modifiedBy: null,
      createdTime: new Date().toDateString(),
      modifiedTime: null,
      period: this.data.period,
      periodTypeId: this.data.periodTypeId,
      scoreType: this.scoreType,
      commentTypeId: CommentType.Comment
    }

    this.getQuarterlySetting();
    this.loadData();
    this.loadKPIScoreData();
    this.loadSmartScoreData();
    this.loadKPIData();
    this.getFisrtByAccountId();
    this.getFisrtCommentByObjectiveId();
  }

  getMonthListInCurrentQuarter(index) {

    const listMonthOfEachQuarter =
        [
        "Result of Jan.",
        "Result of Feb.","Result of Mar.","Result of Apr.",
        "Result of May.","Result of Jun.","Result of Jul.",
        "Result of Aug.","Result of Sep.","Result of Oct.",
        "Result of Nov.","Result of Dec."
       ]
    ;
    const listMonthOfCurrentQuarter = listMonthOfEachQuarter[index - 1];
    return listMonthOfCurrentQuarter;
  }
  getQuarterlySetting() {
    this.quarterlySettingsData = this.data.settings || [];
    this.columns =[];
    for (const month of this.quarterlySettingsData) {
      this.columns.push({ field: `${month}`,
      headerText: this.getMonthListInCurrentQuarter(month),
      month: month
     })
    }
  }
  loadData() {
    this.service.getAllKPIScoreGHRByAccountId(this.data.id, this.currentTime).subscribe(data => {
      this.gridData = data;
      this.objectiveIds = data.filter( (item: any) => {
        return item.isReject == true;
      }).map( (item: any) => { return item.id}) || [];
    });
  }
  loadKPIScoreData() {
    this.kpiScoreService.getById(this.data.id).subscribe(data => {
      this.kpiScoreData = data;
    });
  }
  getFisrtByAccountId() {
    this.kpiScoreService.getFisrtByAccountId(
      this.data.id,
      this.data.periodTypeId,
      this.data.period,
      this.scoreType
    ).subscribe(data => {
      this.point = data?.point;
      this.kpiScoreModel.id = data?.id;
    });
  }
  getFisrtCommentByObjectiveId() {
    this.commentService.getFisrtByAccountId(
      this.data.id,
      this.data.periodTypeId,
      this.data.period,
      this.scoreType
    ).subscribe(data => {
      this.content = data?.content;
      this.commentModel.id = data?.id;
    });
  }
  loadKPIData() {
    this.kpiService.getAll().subscribe(data => {
      this.kpiData = data;
    });
  }
  loadSmartScoreData() {
    this.smartScoreService.getAll().subscribe(data => {
      this.smartScoreData = data;
    });
  }
  public queryCellInfoEvent: EmitType<QueryCellInfoEventArgs> = (args: QueryCellInfoEventArgs) => {
    const data = args.data as any;
    const fields = ['month'];
    for (const month of this.quarterlySettingsData) {
      if (('' + month).includes(args.column.field)) {
        (args.cell as any).innerText = data.resultOfMonth.filter(x=>x.month === month)[0]?.title || "N/A";
      }
    }
  }

  onchangeReject(args, data) {
    if (args) {
      this.objectiveIds.push(data.todolistId);
      this.objectiveIds = this.utilitiesService.toDistinct(this.objectiveIds);
    } else {
      const value = data.todolistId;
      this.objectiveIds = this.utilitiesService.toArrayRemove(this.objectiveIds, value);
    }
  }
  onChangeSmartScore(args) {
    if (args.isInteracted) {
      const kpiScore = this.addKPIScore();
      forkJoin([kpiScore]).subscribe(response => {
        console.log(response)
        const arr = response.map(x=> x.success);
        const checker = arr => arr.every(Boolean);
        if (checker) {
          // this.alertify.success('Successfully 成功地', true);
        } else {
          this.alertify.warning('Not yet complete. Can not release. 尚未完成，無法提交', true);
        }
      })
    }
  }
  addKPIScore() {
    this.kpiScoreModel.point = this.point;
    return this.kpiScoreService.add(this.kpiScoreModel);
  }
  addComment() {
    this.commentModel.content = this.content;
    return this.commentService.add(this.commentModel);
  }

  reject() {
    if (this.utilitiesService.isUndefinedOrNullOrEmpty(this.content)) {
      this.alertify.warning('Please leave a comment. 尚未完成，無法提交', true);
      return;
    }
    if (this.utilitiesService.isUndefinedOrNull(this.point)) {
      this.alertify.warning('Please score smart score first. Not yet complete. Can not release. 尚未完成，無法提交', true);
      return;
    }
    if (this.objectiveIds.length === 0) {
      this.alertify.warning(`There's no reject item, please check remark. 您沒有選擇不合格的項目，請完成勾選`, true);
      return;
    }
    const comment = this.addComment();
    const release = this.service.reject(this.objectiveIds);
    forkJoin([comment, release]).subscribe(response => {
      console.log(response)
      const arr = response.map(x=> x.success);
      const checker = arr => arr.every(Boolean);
      if (checker) {
        this.alertify.success('Successfully 成功地', true);
        this.service.changeMessage(true);
        this.activeModal.close();

      } else {
        this.alertify.warning('Not yet complete. Can not release. 尚未完成，無法提交', true);
      }
    })
  }
  release() {
    const ids = (this.grid.dataSource as any).map( x => { return x.todolistId; }) || [];
    if (ids.length === 0) {
      this.alertify.warning('Not yet complete. Can not release. 尚未完成，無法提交', true);
      return;
    }
    if (this.objectiveIds.length > 0) {
      this.alertify.warning(`You ticked in reject column, please click Reject . 您有勾選不合格的項目，請按Reject`, true);
      return;
    }
    if (this.utilitiesService.isUndefinedOrNull(this.point)) {
      this.alertify.warning('Not yet complete. Can not release. 尚未完成，無法提交', true);
      return;
    }
    // if (
    //   !this.utilitiesService.isUndefinedOrNull(this.point) && this.utilitiesService.isUndefinedOrNullOrEmpty(this.content) ||
    //   this.utilitiesService.isUndefinedOrNull(this.point) && this.utilitiesService.isUndefinedOrNullOrEmpty(this.content)
    // ) {
    //   this.alertify.warning('Please leave a comment. 尚未完成，無法提交', true);
    //   return;
    // }
    const comment = this.addComment();
    const release = this.service.release(ids);
    forkJoin([comment, release]).subscribe(response => {
      console.log(response)
      const arr = response.map(x=> x.success);
      const checker = arr => arr.every(Boolean);
      if (checker) {
        this.alertify.success('Successfully 成功地', true);
        this.service.changeMessage(true);
        this.activeModal.close();

      } else {
        this.alertify.warning('Not yet complete. Can not release. 尚未完成，無法提交', true);
      }
    })
  }
  finish() {

    // if (
    //   !this.utilitiesService.isUndefinedOrNull(this.point) && this.utilitiesService.isUndefinedOrNullOrEmpty(this.content) ||
    //   this.utilitiesService.isUndefinedOrNull(this.point) && this.utilitiesService.isUndefinedOrNullOrEmpty(this.content)
    // ) {
    //   this.alertify.warning('Please leave a comment. 尚未完成，無法提交', true);
    //   return;
    // }

    const comment = this.addComment();
    forkJoin([comment]).subscribe(response => {
      console.log(response)
      const arr = response.map(x=> x.success);
      const checker = arr => arr.every(Boolean);
      if (checker) {
        this.alertify.success(MessageConstants.CREATED_OK_MSG);
        this.service.changeMessage(true);

        this.activeModal.close();

      } else {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    })
  }
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
  }
}
