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
import { AttitudeScoreService } from 'src/app/_core/_service/attitude-score.service';
import { AttitudeScore } from 'src/app/_core/_model/attitude-score';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { KPI } from 'src/app/_core/_model/kpi';
import { Contribution } from 'src/app/_core/_model/contribution';
import { ContributionService } from 'src/app/_core/_service/contribution.service';
import { AttitudeService } from 'src/app/_core/_service/attitude.service';
import { Attitude } from 'src/app/_core/_model/attitude';
import { forkJoin } from 'rxjs';
import { SystemScoreType } from 'src/app/_core/enum/system';
@Component({
  selector: 'app-attitude-score-ghr',
  templateUrl: './attitude-score-ghr.component.html',
  styleUrls: ['./attitude-score-ghr.component.scss']
})
export class AttitudeScoreGHRComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;
  @Input() data: any;
  @Input() scoreType: SystemScoreType;
  gridData: object;
  toolbarOptions = ['Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  editSettings = { showDeleteConfirmDialog: false, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
  model: ToDoList;
  attitudeScoreModel: AttitudeScore;
  attitudeScoreData: AttitudeScore;
  point: number;
  fields: object = { text: 'point', value: 'point' };
  filterSettings = { type: 'Excel' };
  content = '';
  contributionModel: Contribution;
  attitudeData: Attitude[];
  halfYearSettingsData: any;
  columns: any[];
  constructor(
    public activeModal: NgbActiveModal,
    public service: Todolistv2Service,
    public attitudeScoreService: AttitudeScoreService,
    public attitudeService: AttitudeService,
    public contributionService: ContributionService,
    private alertify: AlertifyService,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnInit(): void {
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
    }
    this.contributionModel =  {
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
    }


    this.getHalfYearSetting();
    this.loadData();
    this.loadAttitudeScoreData();
    this.loadKPIData();
    this.getFisrtByObjectiveIdAndScoreBy();
    this.getFisrtContributionByObjectiveId();
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
  getHalfYearSetting() {
    this.halfYearSettingsData = this.data.settings || [];
    this.columns =[];
    for (const month of this.halfYearSettingsData) {
      this.columns.push({ field: `${month}`,
      headerText: this.getMonthListInCurrentQuarter(month),
      month: month
     })
    }
  }
  loadData() {
    this.service.getAllAttitudeScoreGHRByAccountId(this.data.id).subscribe(data => {
      this.gridData = data;
    });
  }
  loadAttitudeScoreData() {
    this.attitudeScoreService.getById(this.data.id).subscribe(data => {
      this.attitudeScoreData = data;
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
    this.contributionService.getFisrtByAccountId(this.data.id, this.data.periodTypeId, this.data.period, this.data.scoreType).subscribe(data => {
      this.content = data?.content;
      this.contributionModel.id = data?.id;
    });
  }
  loadKPIData() {
    this.attitudeService.getAll().subscribe(data => {
      this.attitudeData = data;
    });
  }
  public queryCellInfoEvent: EmitType<QueryCellInfoEventArgs> = (args: QueryCellInfoEventArgs) => {
    const data = args.data as any;
    const fields = ['month'];
    for (const month of this.halfYearSettingsData) {
      if (('' + month).includes(args.column.field)) {
        (args.cell as any).innerText = data.resultOfMonth.filter(x=>x.month === month)[0]?.title || "N/A";
      }
    }
  }

  addAttitudeScore() {
    this.attitudeScoreModel.point = this.point;
    return this.attitudeScoreService.add(this.attitudeScoreModel);
  }
  addContribution() {
    this.contributionModel.content = this.content;
    return this.contributionService.add(this.contributionModel);
  }
  finish() {
    if (!this.point) {
      this.alertify.warning('Not yet complete. Can not submit! 尚未完成，無法提交', true);
      return;
    }
    const attitudeScore =  this.addAttitudeScore();
    forkJoin([attitudeScore]).subscribe(response => {
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
