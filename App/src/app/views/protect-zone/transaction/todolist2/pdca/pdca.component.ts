import { UploadFileComponent } from './../upload-file/upload-file.component';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { Action } from 'src/app/_core/_model/action';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { Todolist2Service } from 'src/app/_core/_service/todolist2.service';
declare var $: any;

@Component({
  selector: 'app-pdca',
  templateUrl: './pdca.component.html',
  styleUrls: ['./pdca.component.scss'],
  providers: [DatePipe]
})
export class PdcaComponent implements OnInit, AfterViewInit {
  @Input() data: any;
  @Input() currentTime: any;
  @ViewChild('grid') grid: GridComponent;
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  toolbarOptions = ['Add', 'Delete', 'Search'];
  policy = '效率精進';
  kpi = 'SHC CTB IE 工時達成率';
  pic = '生產中心 Lai He';
  gridData =[];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  month = '';
  editSettings = { showDeleteConfirmDialog: false, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };

  actions: Action[] = [];
  thisMonthYTD: any;
  thisMonthPerformance: any;
  thisMonthTarget: any;
  targetYTD: any;
  nextMonthTarget: any;
  status: any[];
  result: {
    id: number,
    content: string,
    updateTime: string,
    modifiedTime: string,
    createdTime: string,
    kPIId: number
  };
  content: any;
  performanceValue;
  thisMonthTargetValue;
  nextMonthTargetValue;
  ytdValue;
  thisMonthYTDValue;
  constructor(
    public activeModal: NgbActiveModal,
    public todolist2Service: Todolist2Service,
    private datePipe: DatePipe,
    private alertify: AlertifyService,
    public modalService: NgbModal,
  ) { }

  ngAfterViewInit(): void {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }
  ngOnInit() {
    const month = this.currentTime.getMonth();
    this.month = this.months[month == 1 ? 12 : month - 1];
    this.loadStatusData();
    this.loadData();
  }
  openUploadModalComponent() {
    const modalRef = this.modalService.open(UploadFileComponent, { size: 'md', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.data = this.data;
    modalRef.componentInstance.currentTime = this.currentTime;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
  }
  onChangeThisMonthPerformance(value) {
    if (this.thisMonthPerformance != null) {
      this.thisMonthPerformance.performance = +value;
    } else {
      this.thisMonthPerformance = {
        id: 0,
        value: 0,
        performance: +value,
        kPIId: this.data.id,
        targetTime: new Date().toISOString(),
        createdTime: new Date().toISOString(),
        modifiedTime: null,
        yTD: 0,
        createdBy: +JSON.parse(localStorage.getItem('user')).id,
      };
    }
  }
  onChangeThisMonthTarget(value) {
    if (this.thisMonthTarget != null) {
      this.thisMonthTarget.value = +value;
    } else {
      this.thisMonthTarget = {
        id: 0,
        value: +value,
        performance: 0,
        kPIId: this.data.id,
        targetTime: new Date().toISOString(),
        createdTime: new Date().toISOString(),
        modifiedTime: null,
        yTD: 0,
        createdBy: +JSON.parse(localStorage.getItem('user')).id,
      };
    }
  }
  onChangeNextMonthTarget(value) {
    if (this.nextMonthTarget != null) {
      this.nextMonthTarget.value = +value;
    } else {
      this.nextMonthTarget = {
        id: 0,
        value: +value,
        performance: 0,
        kPIId: this.data.id,
        targetTime: new Date().toISOString(),
        createdTime: new Date().toISOString(),
        modifiedTime: null,
        yTD: 0,
        createdBy: +JSON.parse(localStorage.getItem('user')).id,
        submitted: false
      };
    }
  }
  onChangeThisMonthYTD(value) {
    if (this.thisMonthYTD != null) {
      this.thisMonthYTD.yTD = +value;
    } else {
      this.thisMonthYTD = {
        id: 0,
        value: this.thisMonthTargetValue,
        performance: this.performanceValue,
        kPIId: this.data.id,
        targetTime: new Date().toISOString(),
        createdTime: new Date().toISOString(),
        modifiedTime: null,
        yTD: +value,
        createdBy: +JSON.parse(localStorage.getItem('user')).id,
      };
    }
  }
  download() {
    this.todolist2Service.download(this.data.id, (this.currentTime as Date).toLocaleDateString() ).subscribe((data: any) => {
      const blob = new Blob([data],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      const ct = new Date();
      link.download = `${ct.getFullYear()}${ct.getMonth()}${ct.getDay()}_archive.zip`;
      link.click();
    });
  }
  onChangeTargetYTD(value) {
    if (this.targetYTD != null) {
      this.targetYTD.value = +value;
    } else {
    this.targetYTD = {
      id: 0,
      value: +value,
      createdTime: new Date().toISOString(),
      modifiedBy: null,
      modifiedTime: null,
      createdBy: +JSON.parse(localStorage.getItem('user')).id,
      kPIId: this.data.id
    };
  }
  }
  onChangeContent(value, i) {
    this.gridData[i].doContent = value;
  }
  onChangeArchivement(value, i) {
    this.gridData[i].achievement = value;

  }
  onChangeStatus(value, i) {
    this.gridData[i].statusId = JSON.parse(value);

  }
  onChangeResult(value) {
    this.content = value || '';
    if (this.result != null) {
      this.result.content = value;
    } else {
      this.result = {
        id: 0,
        content: this.content,
        kPIId: this.data.id,
        createdTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        modifiedTime: null
      };
    }
  }
  loadData() {
    this.loadKPIData();
    this.loadTargetData();
    this.loadPDCAAndResultData();
    this.loadActionData();
  }
  loadPDCAAndResultData() {
    this.gridData = [];
    const currentTime = (this.currentTime as Date).toLocaleDateString();
    this.todolist2Service.getPDCAForL0(this.data.id || 0, currentTime).subscribe(res => {
      this.gridData = res.data;
      this.result = res.result;
      this.content = this.result?.content;
    });
  }
  loadActionData() {
    this.actions = [];
    const currentTime = (this.currentTime as Date).toLocaleDateString();
    this.todolist2Service.getActionsForUpdatePDCA(this.data.id || 0, currentTime).subscribe(res => {
      this.actions = res.actions as Action[] || [];
    });
  }
  loadKPIData() {
    const currentTime = (this.currentTime as Date).toLocaleDateString();
    this.todolist2Service.getKPIForUpdatePDC(this.data.id || 0, currentTime).subscribe(res => {
      this.kpi = res.kpi;
      this.policy = res.policy;
      this.pic = res.pic;
    });
  }

  loadTargetData() {
    const currentTime = (this.currentTime as Date).toLocaleDateString();
    this.todolist2Service.getTargetForUpdatePDCA(this.data.id || 0, currentTime).subscribe(res => {
      this.thisMonthYTD = res.thisMonthYTD;
      this.thisMonthPerformance = res.thisMonthPerformance;
      this.thisMonthTarget = res.thisMonthTarget;
      this.targetYTD = res.targetYTD;
      this.nextMonthTarget = res.nextMonthTarget;

      this.performanceValue = this.thisMonthPerformance?.performance;
      this.thisMonthTargetValue = this.thisMonthTarget?.value;
      this.nextMonthTargetValue = this.nextMonthTarget?.value;
      this.ytdValue = this.targetYTD?.value;
      this.thisMonthYTDValue = this.thisMonthYTD?.ytd
    });
  }
  loadStatusData() {
    this.status = [];
    this.todolist2Service.getStatus().subscribe(res => {
      this.status = res || [];

    });
  }
  submit() {
    this.post(true);
  }
  back() {
    this.post(false);
  }
  validate() {
    if (!this.thisMonthTargetValue) {
      this.alertify.warning('Please input this month target');
      return false;
    }
    if (!this.performanceValue) {
      this.alertify.warning('Please input this month performance');
      return false;
    }

    if (!this.thisMonthYTDValue) {
      this.alertify.warning('Please input this month YTD');
      return false;
    }
    if (!this.nextMonthTargetValue) {
      this.alertify.warning('Please input next month target');
      return false;
    }
    const dataSource = (this.grid.dataSource as Action[]) || [];

    if (dataSource.length == 0) {
      this.alertify.warning('Please create actions');
      return false;
    }

    return true;
  }
  post(submitted) {
    if (this.validate() == false) return;
    const target = {
      id: this.thisMonthTarget.id,
      value: this.thisMonthTargetValue,
      performance: this.performanceValue,
      kPIId: this.data.id,
      targetTime: this.thisMonthYTD.targetTime,
      createdTime: this.thisMonthYTD.createdTime,
      modifiedTime: this.thisMonthYTD.modifiedTime,
      yTD: this.thisMonthYTDValue,
      createdBy: this.thisMonthYTD.createdBy,
      submitted: submitted
    };
    const updatePDCA = this.gridData;

    const dataSource = this.grid.dataSource as Action[];
    const actions = dataSource.map(x => {
      return {
        id: x.id,
        target: x.target,
        content: x.content,
        deadline: this.datePipe.transform(x.deadline, 'MM/dd/yyyy'),
        accountId: +JSON.parse(localStorage.getItem('user')).id,
        kPIId: this.data.id,
        statusId: x.statusId,
        createdTime: new Date().toISOString(),
        modifiedTime: null
      }
    })
    const request = {
      target: target,
      targetYTD: this.targetYTD,
      nextMonthTarget: this.nextMonthTarget,
      actions: actions,
      updatePDCA: updatePDCA,
      result: this.result,
      currentTime: this.datePipe.transform(this.currentTime, 'MM/dd/yyyy'),
    }
    console.log(request);
    this.todolist2Service.submitUpdatePDCA(request).subscribe(
      (res) => {
        if (res.success === true) {
          this.todolist2Service.changeMessage(true);
          this.activeModal.close();
        } else {
          this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
        }
      },
      (err) => this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG)
    );
  }
}
