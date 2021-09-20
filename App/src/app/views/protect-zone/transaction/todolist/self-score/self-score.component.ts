import { AttitudeScoreService } from 'src/app/_core/_service/attitude-score.service';
import { filter, retry } from 'rxjs/operators';
import { UtilitiesService } from './../../../../../_core/_service/utilities.service';
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
import { CommentType, PeriodType, Quarter, SystemScoreType } from 'src/app/_core/enum/system';
import { AttitudeScore } from 'src/app/_core/_model/attitude-score';
@Component({
  selector: 'app-self-score',
  templateUrl: './self-score.component.html',
  styleUrls: ['./self-score.component.scss']
})
export class SelfScoreComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;
  @Input() data: any;
  @Input() periodTypeCode: PeriodType;
  @Input() scoreType: SystemScoreType;
  gridData: object;
  toolbarOptions = ['Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  editSettings = { showDeleteConfirmDialog: false, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
  model: ToDoList;
  kpiScoreModel: KPIScore;
  kpiScoreData: KPIScore;
  point: number;
  kpiData: KPI[];
  commentModel: Comment;
  fields: object = { text: 'point', value: 'point' };
  filterSettings = { type: 'Excel' };
  content = '';
  quarterlySettingsData = [];
  columns = [];
  attitudeScoreData:  AttitudeScore;
  hasFunctionalLeader = false;
  functionalLeaderCommentContent: string;
  functionalLeaderAttitudeScoreData: any;
  isQuarter2Or4: boolean;
  functionalLeaderScored: boolean;
  constructor(
    public activeModal: NgbActiveModal,
    public service: Todolistv2Service,
    public kpiScoreService: KPIScoreService,
    public attitudeScoreService: AttitudeScoreService,
    public kpiService: KPIService,
    public commentService: Commentv2Service,
    private alertify: AlertifyService,
    private todolistService: Todolistv2Service,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnInit(): void {
    this.hasFunctionalLeader = this.data.hasFunctionalLeader;
    this.isQuarter2Or4 = this.data.period == Quarter.Q2 || this.data.period == Quarter.Q4;

    this.kpiScoreModel = {
      id: 0,
      periodTypeId: this.data.periodTypeId,
      period: this.data.period,
      point: this.point,
      scoreBy: +JSON.parse(localStorage.getItem('user')).id,
      modifiedTime: null,
      createdTime: new Date().toDateString(),
      accountId: +JSON.parse(localStorage.getItem('user')).id,
      scoreType: this.scoreType
    }
    this.commentModel = {
      id: 0,
      content: this.content,
      createdBy: +JSON.parse(localStorage.getItem('user')).id,
      accountId: +JSON.parse(localStorage.getItem('user')).id,
      modifiedBy: null,
      createdTime: new Date().toDateString(),
      modifiedTime: null,
      period: this.data.period,
      periodTypeId: this.data.periodTypeId,
      scoreType: this.scoreType,
      commentTypeId: CommentType.SelfEvaluation
    };
    if (this.hasFunctionalLeader === true) {
      this.getFunctionalLeaderCommentByAccountId();
      this.getFunctionalLeaderAttitudeScoreByAccountId();
    }

    this.getQuarterlySetting();
    this.loadData();
    this.loadKPIData();
    this.getFisrtSelfScoreByAccountId();
    this.getL0SelfEvaluationCommentByAccountId();
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
    this.service.getAllKPIScoreL0ByPeriod(this.data.period).subscribe(data => {
      this.gridData = data;
    });
  }

  getFunctionalLeaderAttitudeScoreByAccountId() {
    this.attitudeScoreService.getFunctionalLeaderAttitudeScoreByAccountId(
      +JSON.parse(localStorage.getItem('user')).id,
      this.data.halfYearId,
      this.data.period
    ).subscribe(data => {
      this.functionalLeaderAttitudeScoreData = data?.point || 0;
      this.functionalLeaderScored = this.functionalLeaderAttitudeScoreData !== 0;
    });
  }
  getFisrtSelfScoreByAccountId() {
    this.kpiScoreService.getFisrtSelfScoreByAccountId(
      +JSON.parse(localStorage.getItem('user')).id,
      this.data.periodTypeId,
      this.data.period,
      this.scoreType
    ).subscribe(data => {
      this.point = data?.point;
      this.kpiScoreModel.id = data?.id;
    });
  }
  getL0SelfEvaluationCommentByAccountId() {
    this.commentService.getL0SelfEvaluationCommentByAccountId(
      +JSON.parse(localStorage.getItem('user')).id,
      this.data.periodTypeId,
      this.data.period
    ).subscribe(data => {
      this.content = data?.content;
      this.commentModel.id = data?.id;
    });
  }
  getFunctionalLeaderCommentByAccountId() {
    this.commentService.getFunctionalLeaderCommentByAccountId(
      +JSON.parse(localStorage.getItem('user')).id,
      this.data.halfYearId,
      this.data.period
    ).subscribe(data => {
      this.functionalLeaderCommentContent = data?.content;
    });
  }
  loadKPIData() {
    this.kpiService.getAll().subscribe(data => {
      this.kpiData = data;
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

  addKPIScore() {
    this.kpiScoreModel.point = this.point;
    return this.kpiScoreService.add(this.kpiScoreModel);
  }
  addComment() {
    this.commentModel.content = this.content;
    return this.commentService.add(this.commentModel);
  }
  finish() {
    if (this.point != 0 && this.utilitiesService.isUndefinedOrNullOrEmpty(this.content)) {
      this.alertify.warning('Please leave a Self - Evaluation! <br>Not yet complete. Can not submit! 尚未完成，無法提交', true);
      return;
    }
    if (this.point === 0 && !this.utilitiesService.isUndefinedOrNullOrEmpty(this.content)) {
      this.alertify.warning('Please choose a special score. <br>Not yet complete. Can not submit! 尚未完成，無法提交', true);
      return;
    }

    const kpiScore = this.addKPIScore();
    const comment = this.addComment();
    forkJoin([kpiScore, comment]).subscribe(response => {
      console.log(response)
      const arr = response.map(x=> x.success);
      const checker = arr => arr.every(Boolean);
      if (checker) {
        this.alertify.success(MessageConstants.CREATED_OK_MSG);
        this.todolistService.changeMessage(true);
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
