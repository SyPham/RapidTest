import { ResultOfMonth, ResultOfMonthRequest } from './../../../../../_core/_model/result-of-month';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { Objective } from 'src/app/_core/_model/objective';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { ObjectiveService } from 'src/app/_core/_service/objective.service';
import { ResultOfMonthService } from 'src/app/_core/_service/result-of-month.service';
import { Todolistv2Service } from 'src/app/_core/_service/todolistv2.service';
import { Commentv2Service } from 'src/app/_core/_service/commentv2.service';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-result',
  templateUrl: './update-result.component.html',
  styleUrls: ['./update-result.component.scss'],
  providers: [DatePipe]
})
export class UpdateResultComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;
  @Input() data: any;
  @Input() isReject: any;
  @Input() currentTime: any;
  gridData: object;
  gridResultOfMonthData: ResultOfMonth[];
  toolbarOptions = ['Search'];
  toolbarOptions2 = [''];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  editSettings = { showDeleteConfirmDialog: false, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
  model: ResultOfMonthRequest;
  title: string;
  content: string;
  currentTimeRequest: any;
  constructor(
    public activeModal: NgbActiveModal,
    private service: ObjectiveService,
    private todolistService: Todolistv2Service,
    private alertify: AlertifyService,
    private commentService: Commentv2Service,
    private resultOfMonthService: ResultOfMonthService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.currentTimeRequest = this.datePipe.transform(this.currentTime, "YYYY-MM-dd HH:mm");
    this.title = '';
    if (this.isReject) {
      this.getGHRCommentByAccountId();
    }
    this.loadCurrentResultOfMonthData();
    this.loadData();
    this.model = {
      id: 0,
      objectiveId: this.data.id,
      title: '',
      createdBy: +JSON.parse(localStorage.getItem('user')).id,
      period: this.data.period
    };
  }


  getMonthText() {
    const month = this.currentTime.getMonth();
    const listMonthOfEachQuarter =
        [
        "Result of Jan.",
        "Result of Feb.","Result of Mar.","Result of Apr.",
        "Result of May.","Result of Jun.","Result of Jul.",
        "Result of Aug.","Result of Sep.","Result of Oct.",
        "Result of Nov.","Result of Dec."
       ]
    ;
    const listMonthOfCurrentQuarter = listMonthOfEachQuarter[month];
    return listMonthOfCurrentQuarter;
  }
  getTitleText() {
    const month = this.currentTime.getMonth();
    const listMonthOfEachQuarter =
        [
        "Jan.",
        "Feb.","Mar.","Apr.",
        "May.","Jun.","Jul.",
        "Aug.","Sep.","Oct.",
        "Nov.","Dec."
       ]
    ;
    const listMonthOfCurrentQuarter = listMonthOfEachQuarter[month];
    return listMonthOfCurrentQuarter;
  }
  loadData() {
    this.todolistService.getAllByObjectiveIdAsTree(this.data.id).subscribe(data => {
      this.gridData = data;
    });
  }
  getGHRCommentByAccountId() {
    this.commentService.getGHRCommentByAccountId(
      +JSON.parse(localStorage.getItem('user')).id,
      this.data.quarterPeriodTypeId,
      this.data.quarter
    ).subscribe(data => {
      this.content = data?.content;
    });
  }
  loadCurrentResultOfMonthData() {
    this.resultOfMonthService.getAllByMonth(this.data.id, this.currentTimeRequest).subscribe(data => {
      this.gridResultOfMonthData = data || [];
      this.title =  data[0]?.title;
    });
  }
  updateResultOfMonth() {
    const data = [];
    const gridData = this.gridResultOfMonthData || [];
    if (!this.title) {
      this.alertify.warning('Not yet complete. Can not submit! 尚未完成，無法提交', true);
      return;
    }
    this.model.title = this.title;
    this.model.id = gridData[0]?.id || 0;

    const updateResultOfMonth = this.resultOfMonthService.updateResultOfMonth(this.model);
    const disableReject = this.todolistService.disableReject([this.data.todolistId]);
    const sources = [updateResultOfMonth];
    if (this.isReject) {
      sources.push(disableReject);
    }
    forkJoin(sources).subscribe(response => {
      console.log(response)
      const arr = response.map(x=> x.success);
      const checker = arr => arr.every(Boolean);
      if (checker) {
        this.alertify.success(MessageConstants.UPDATED_OK_MSG);
        this.loadCurrentResultOfMonthData();
        this.todolistService.changeMessage(true);
        this.activeModal.close();
      } else {
        this.alertify.warning('Not yet complete. Can not submit! 尚未完成，無法提交', true);
      }
    },
    (error) => {
      this.alertify.warning('Not yet complete. Can not submit! 尚未完成，無法提交', true);
    })
  }
  finish() {
    this.updateResultOfMonth();
  }
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
  }
}
