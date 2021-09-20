import { SpecialScoreService } from './../../../../../_core/_service/special-score.service';
import { UtilitiesService } from './../../../../../_core/_service/utilities.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ToDoList } from 'src/app/_core/_model/todolistv2';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { Todolistv2Service } from 'src/app/_core/_service/todolistv2.service';

import { QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { EmitType } from '@syncfusion/ej2-base';
import { AttitudeScoreService } from 'src/app/_core/_service/attitude-score.service';
import { AttitudeScore } from 'src/app/_core/_model/attitude-score';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { Contribution } from 'src/app/_core/_model/contribution';
import { ContributionService } from 'src/app/_core/_service/contribution.service';
import { AttitudeService } from 'src/app/_core/_service/attitude.service';
import { Attitude } from 'src/app/_core/_model/attitude';
import { forkJoin } from 'rxjs';
import { CommentType, SystemScoreType } from 'src/app/_core/enum/system';
import { SpecialContributionScoreService } from 'src/app/_core/_service/special-contribution-score.service';
import { SpecialScore } from 'src/app/_core/_model/special-score';
import { SpecialContributionScore } from 'src/app/_core/_model/special-contribution-score';
import { Commentv2Service } from 'src/app/_core/_service/commentv2.service';
import { Comment } from 'src/app/_core/_model/commentv2';

@Component({
  selector: 'app-attitude-score-l2',
  templateUrl: './attitude-score-l2.component.html',
  styleUrls: ['./attitude-score-l2.component.scss']
})
export class AttitudeScoreL2Component implements OnInit {
  @ViewChild('grid') grid: GridComponent;
  @Input() data: any;
  @Input() scoreType: SystemScoreType;
  gridData: object;
  toolbarOptions = ['Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  editSettings = { showDeleteConfirmDialog: false, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
  model: ToDoList;
  attitudeScoreModel: AttitudeScore;
  specialContributionScoreModel: SpecialContributionScore;
  attitudeScoreData: AttitudeScore;
  point: number;
  specialPoint: number = 0;
  fields: object = { text: 'point', value: 'point' };
  filterSettings = { type: 'Excel' };
  content = '';
  specialContent = '';
  commentContent = '';
  contributionModel: Contribution;
  attitudeData: Attitude[];
  commentModel: Comment;
  halfYearSettingsData: any;
  columns: any[];
  specialScoreData: SpecialScore[];
  hasFunctionalLeader: any;
  functionalLeaderCommentContent: string;
  functionalLeaderAttitudeScoreData: number;

  l1SpecialContributionContent: any;
  specialContributionScore: any;

  l1AttitudeScoreData: any;
  l1CommentContent: any;
  functionalLeaderScored: boolean;
  l1Scored: boolean;
  specialContributionScored: boolean;
  constructor(
    public activeModal: NgbActiveModal,
    public service: Todolistv2Service,
    public attitudeScoreService: AttitudeScoreService,
    public attitudeService: AttitudeService,
    public contributionService: ContributionService,
    public specialScoreService: SpecialScoreService,
    public specialContributionScoreService: SpecialContributionScoreService,
    public commentService: Commentv2Service,
    private alertify: AlertifyService,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnInit(): void {
    this.hasFunctionalLeader = this.data.hasFunctionalLeader;
    this.attitudeScoreModel = {
      id: 0,
      periodTypeId: this.data.periodTypeId,
      period: this.data.period,
      point: this.point,
      accountId: this.data.id,
      scoreBy: +JSON.parse(localStorage.getItem('user')).id,
      createdTime: new Date().toDateString(),
      modifiedTime: null,
      scoreType: this.scoreType
    };
    this.specialContributionScoreModel = {
      id: 0,
      periodTypeId: this.data.periodTypeId,
      period: this.data.period,
      point: this.specialPoint,
      accountId: this.data.id,
      scoreBy: +JSON.parse(localStorage.getItem('user')).id,
      createdTime: new Date().toDateString(),
      modifiedTime: null,
      scoreType: this.scoreType
    };
    this.contributionModel = {
      id: 0,
      content: this.content,
      createdBy: +JSON.parse(localStorage.getItem('user')).id,
      accountId: this.data.id,
      modifiedBy: null,
      createdTime: new Date().toDateString(),
      modifiedTime: null,
      periodTypeId: this.data.periodTypeId,
      period: this.data.period,
      scoreType: this.scoreType
    };
    this.commentModel = {
      id: 0,
      content: this.commentContent,
      createdBy: +JSON.parse(localStorage.getItem('user')).id,
      accountId: this.data.id,
      modifiedBy: null,
      createdTime: new Date().toDateString(),
      modifiedTime: null,
      period: this.data.period,
      periodTypeId: this.data.periodTypeId,
      scoreType: this.scoreType,
      commentTypeId: CommentType.Comment
    };
    if (this.hasFunctionalLeader === true) {
      this.getFunctionalLeaderCommentByAccountId();
      this.getFunctionalLeaderAttitudeScoreByAccountId();
    }
    this.getHalfYearSetting();
    this.loadData();
    this.loadAttitudeScoreData();
    this.loadAttitudeData();
    this.loadSpecialScoreData();
    this.getFisrtByObjectiveIdAndScoreBy();
    this.getFisrtContributionByObjectiveId();
    this.getFisrtCommentByObjectiveId();
    this.getFisrtSpecialContributionScoreByObjectiveIdAndScoreBy();

    //Contribution
    this.getL1CommentContributionByAccountId();
    // L1 Special Score L0
    this.getSpecialScoreByAccountId();

    // Comment
    this.getL1CommentByAccountId();
    // L1 Attitude Score L0
    this.getL1AttitudeScoreByAccountId();

  }
  getMonthListInCurrentQuarter(index) {

    const listMonthOfEachQuarter =
      [
        "Result of Jan.",
        "Result of Feb.", "Result of Mar.", "Result of Apr.",
        "Result of May.", "Result of Jun.", "Result of Jul.",
        "Result of Aug.", "Result of Sep.", "Result of Oct.",
        "Result of Nov.", "Result of Dec."
      ]
      ;
    const listMonthOfCurrentQuarter = listMonthOfEachQuarter[index - 1];
    return listMonthOfCurrentQuarter;
  }
  getHalfYearSetting() {
    this.halfYearSettingsData = this.data.settings || [];
    this.columns = [];
    for (const month of this.halfYearSettingsData) {
      this.columns.push({
        field: `${month}`,
        headerText: this.getMonthListInCurrentQuarter(month),
        month: month
      })
    }
  }
  loadData() {
    this.service.getAllAttitudeScoreL1ByAccountId(this.data.id).subscribe(data => {
      this.gridData = data;
    });
  }
  loadAttitudeScoreData() {
    this.attitudeScoreService.getById(this.data.id).subscribe(data => {
      this.attitudeScoreData = data;
    });
  }
  getFunctionalLeaderAttitudeScoreByAccountId() {
    this.attitudeScoreService.getFunctionalLeaderAttitudeScoreByAccountId(
      this.data.id,
      this.data.periodTypeId,
      this.data.period,
    ).subscribe(data => {
      this.functionalLeaderAttitudeScoreData = data?.point || 0;
      this.functionalLeaderScored = this.functionalLeaderAttitudeScoreData > 0;
    });
  }
  getL1AttitudeScoreByAccountId() {
    this.attitudeScoreService.getL1AttitudeScoreByAccountId(
      this.data.id,
      this.data.periodTypeId,
      this.data.period,
    ).subscribe(data => {
      this.l1AttitudeScoreData = data?.point || 0;
      this.l1Scored = this.l1AttitudeScoreData > 0;
    });
  }
  getFisrtByObjectiveIdAndScoreBy() {
    this.attitudeScoreService.getFisrtByAccountId(
      this.data.id,
      this.data.periodTypeId,
      this.data.period,
      this.scoreType
    ).subscribe(data => {
      this.point = data?.point;
      this.attitudeScoreModel.id = data?.id;
    });
  }
  getFisrtContributionByObjectiveId() {
    this.contributionService.getFisrtByAccountId(
      this.data.id,
      this.data.periodTypeId,
      this.data.period,
      this.scoreType).subscribe(data => {
      this.content = data?.content;
      this.contributionModel.id = data?.id;
    });
  }
  getFunctionalLeaderCommentByAccountId() {
    this.commentService.getFunctionalLeaderCommentByAccountId(
      this.data.id,
      this.data.periodTypeId,
      this.data.period
    ).subscribe(data => {
      this.functionalLeaderCommentContent = data?.content;
    });
  }
  getL1CommentByAccountId() {
    this.commentService.getL1CommentByAccountId(
      this.data.id,
      this.data.periodTypeId,
      this.data.period
    ).subscribe(data => {
      this.l1CommentContent = data?.content;
    });
  }
  getFisrtCommentByObjectiveId() {
    this.commentService.getFisrtByAccountId(
      this.data.id,
      this.data.periodTypeId,
      this.data.period,
      this.scoreType
    ).subscribe(data => {
      this.commentContent = data?.content;
      this.commentModel.id = data?.id;
    });
  }
  getSpecialScoreByAccountId() {
    this.specialContributionScoreService.getSpecialScoreByAccountId(
      this.data.id,
      this.data.periodTypeId,
      this.data.period,
      this.scoreType
    ).subscribe(data => {
      this.specialContributionScore = data?.point || 0;
      this.specialContributionScored = this.specialContributionScore !== 0;
    });
  }

  getL1CommentContributionByAccountId() {
    this.contributionService.getL1CommentByAccountId(
      this.data.id,
      this.data.periodTypeId,
      this.data.period
    ).subscribe(data => {
      this.l1SpecialContributionContent = data?.content;
    });
  }
  getFisrtSpecialContributionScoreByObjectiveIdAndScoreBy() {
    this.specialContributionScoreService.getFisrtByAccountId(
      this.data.id,
      this.data.periodTypeId,
      this.data.period,
      this.scoreType
    ).subscribe(data => {
      this.specialPoint = data?.point || 0;
      this.specialContributionScoreModel.id = data?.id;
    });

  }
  loadAttitudeData() {
    this.attitudeService.getAll().subscribe(data => {
      this.attitudeData = data;
    });
  }
  loadSpecialScoreData() {
    this.specialScoreService.getAll().subscribe(data => {
      this.specialScoreData = data;
    });
  }
  public queryCellInfoEvent: EmitType<QueryCellInfoEventArgs> = (args: QueryCellInfoEventArgs) => {
    const data = args.data as any;
    const fields = ['month'];
    for (const month of this.halfYearSettingsData) {
      if (('' + month).includes(args.column.field)) {
        (args.cell as any).innerText = data.resultOfMonth.filter(x => x.month === month)[0]?.title || "N/A";
      }
    }
  }
  addComment() {
    this.commentModel.content = this.commentContent;
    return this.commentService.add(this.commentModel);
  }
  addAttitudeScore() {
    this.attitudeScoreModel.point = this.point;
    return this.attitudeScoreService.add(this.attitudeScoreModel);
  }
  addSpecialContributionScore() {
    this.specialContributionScoreModel.point = this.specialPoint;
    return this.specialContributionScoreService.add(this.specialContributionScoreModel);
  }
  addContribution() {
    this.contributionModel.content = this.content;
    return this.contributionService.add(this.contributionModel);
  }
  finish() {
    if (this.utilitiesService.isUndefinedOrNull(this.point)) {
      this.alertify.warning('Please choose a attitude score. <br>Not yet complete. Can not submit! 尚未完成，無法提交', true);
      return;
    }
    if (this.utilitiesService.isUndefinedOrNullOrEmpty(this.commentContent)) {
      this.alertify.warning('Please leave a comment. <br>Not yet complete. Can not submit! 尚未完成，無法提交', true);
      return;
    }
    if (this.specialPoint != 0 && this.utilitiesService.isUndefinedOrNullOrEmpty(this.content)) {
      this.alertify.warning('Please leave a special contribution or mistake! <br>Not yet complete. Can not submit! 尚未完成，無法提交', true);
      return;
    }
    if (this.specialPoint === 0 && !this.utilitiesService.isUndefinedOrNullOrEmpty(this.content)) {
      this.alertify.warning('Please choose a special score. <br>Not yet complete. Can not submit! 尚未完成，無法提交', true);
      return;
    }
    const attitudeScore = this.addAttitudeScore();
    const contribution = this.addContribution();
    const specialContributionScore = this.addSpecialContributionScore();
    const comment = this.addComment();

    forkJoin([attitudeScore, contribution, specialContributionScore, comment]).subscribe(response => {
      console.log(response)
      const arr = response.map(x => x.success);
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
