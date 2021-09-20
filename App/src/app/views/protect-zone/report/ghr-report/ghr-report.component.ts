import { ReportService } from './../../../../_core/_service/report.service';
import { AccountGroup } from './../../../../_core/_model/account.group';
import { BaseComponent } from 'src/app/_core/_component/base.component';
import { Component, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { GridComponent, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmitType } from '@syncfusion/ej2-base';
import { MessageConstants } from 'src/app/_core/_constants/system';

@Component({
  selector: 'app-ghr-report',
  templateUrl: './ghr-report.component.html',
  styleUrls: ['./ghr-report.component.scss']
})
export class GhrReportComponent extends BaseComponent implements OnInit {

  data: any[] = [];
  modalReference: NgbModalRef;
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  accountCreate: AccountGroup;
  accountUpdate: AccountGroup;
  setFocus: any;
  locale = localStorage.getItem('lang');
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: false, allowDeleting: false, mode: 'Normal' };
  editCommentSettings = { showDeleteConfirmDialog: false, allowEditing: true, allowAdding: false, allowDeleting: false, mode: 'Normal' };
  toolbarOptions = ['Search'];
  @ViewChild('detailModal') detailModal: NgbModalRef;
  itemData: any;
  detailH1: any;
  detailH2: any;
  avg: number = 0;
  modalRef: NgbModalRef;
  userid: any;
  halfYearSettingsData: any;
  columns: any[];
  halfYearSetting: any;
  gridDataH1: any;
  ResultOfMonthData: any;
  Resultcolumns: any[];
  kpicommentH1: any;
  Q1CommentDefault: string;
  tempQ1Change: string;
  Q2CommentDefault: string;
  tempQ2Change: string;
  dataCommentPicked = [];
  dataAtScorePicked = [];
  dataSpeScorePicked = [];
  attitudecommentData: any;
  H1CommentDefault: string;
  tempH1Change: string;
  atScoreData: any;
  L1AtDefault: any;
  L2AtDefault: any;
  FLAtDefault: any;
  tempL1AtChange: any;
  tempL2AtChange: any;
  tempFLAtChange: any;
  kpiScoreData: any;
  specialScoreData: any;
  h1Score: any;
  dept: any;
  name: any;
  SpeCommentDefault: any;
  tempSpeChange: any;
  title: string;
  titles: string;

  isShow: boolean;
  topPosToStartShowing = 0;
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    console.log('aa');
  }
  constructor(
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private spinner: NgxSpinnerService,
    private service: ReportService,
    private route: ActivatedRoute,
  ) { super(); }
  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.loadData();
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
}
  gotoTop() {
    console.log('aaa');
    window.scrollTo(0, 0)
  }
  actionBeginKPIComment(args) {
    if (args.requestType === 'beginEdit') {
      this.Q1CommentDefault = args.rowData.q1
      this.Q2CommentDefault = args.rowData.q2
    }
    if (args.requestType === 'save') {
      this.tempQ1Change = args.data.q1;
      this.tempQ2Change = args.data.q2
      let Q1Change = this.Q1CommentDefault.length < this.tempQ1Change.length
      || this.Q1CommentDefault.length > this.tempQ1Change.length;
      let Q2Change = this.Q2CommentDefault.length < this.tempQ2Change.length
      || this.Q2CommentDefault.length > this.tempQ2Change.length;

      if(Q1Change) {

        if(args.data.q1ID > 0) {
          const model = {
            ID: args.data.q1ID,
            Content: args.data.q1
          }
          const data = this.dataCommentPicked.filter(x => x.ID === args.data.q1ID);
          if(data.length === 0) {
            this.dataCommentPicked.push(model)
          } else {
            for (const item of data) {
              for (var i = 0; i < data.length; i++) {
                if (item.ID === args.data.q1ID) {
                  item.Content = args.data.q1;
                  break;
                }
              }
            }
          }
        }

      }
      if(Q2Change) {
        if(args.data.q2ID > 0) {
          const model = {
            ID: args.data.q2ID,
            Content: args.data.q2
          }
          const data = this.dataCommentPicked.filter(x => x.ID === args.data.q2ID);
          if(data.length === 0) {
            this.dataCommentPicked.push(model)
          } else {
            for (const item of data) {
              for (var i = 0; i < data.length; i++) {
                if (item.ID === args.data.q2ID) {
                  item.Content = args.data.q2;
                  break;
                }
              }
            }
          }
        }
      }


    }

  }
  onDoubleClickKPIComment(args) {
  }
  actionCompleteKPIComment(args) {
    // if (args.requestType === 'beginEdit') {
    //   console.log(args);
    //   if (args.rowData?.q1ID === 0) {
    //     args.form.elements.namedItem('q2').focus(); // Set focus to the Target element
    //   }
    //   if (args.rowData?.q2ID === 0) {
    //     args.form.elements.namedItem('q1').focus(); // Set focus to the Target element
    //   }
    // }
  }
  // end life cycle ejs-grid
  // api
  actionBeginAtComment(args) {
    if (args.requestType === 'beginEdit') {
      this.H1CommentDefault = args.rowData.h1
    }
    if (args.requestType === 'save') {
      this.tempH1Change = args.data.h1;
      let H1Change = this.H1CommentDefault.length < this.tempH1Change.length
      || this.H1CommentDefault.length > this.tempH1Change.length;


      if(H1Change) {

        if(args.data.h1ID > 0) {
          const model = {
            ID: args.data.h1ID,
            Content: args.data.h1
          }
          const data = this.dataCommentPicked.filter(x => x.ID === args.data.h1ID);
          if(data.length === 0) {
            this.dataCommentPicked.push(model)
          } else {
            for (const item of data) {
              for (var i = 0; i < data.length; i++) {
                if (item.ID === args.data.h1ID) {
                  item.Content = args.data.h1;
                  break;
                }
              }
            }
          }
        }

      }



    }

  }

  actionCompleteAtComment(args) {
    // if (args.requestType === 'beginEdit') {
    //   console.log(args);
    //   if (args.rowData?.q1ID === 0) {
    //     args.form.elements.namedItem('q2').focus(); // Set focus to the Target element
    //   }
    //   if (args.rowData?.q2ID === 0) {
    //     args.form.elements.namedItem('q1').focus(); // Set focus to the Target element
    //   }
    // }
  }

  actionBeginAtScore(args) {
    if (args.requestType === 'beginEdit') {
      this.L1AtDefault = args.rowData.l1
      this.L2AtDefault = args.rowData.l2
      this.FLAtDefault = args.rowData.fl
    }
    if (args.requestType === 'save') {
      this.tempL1AtChange = parseInt(args.data.l1) ;
      this.tempL2AtChange = parseInt(args.data.l2) ;
      this.tempFLAtChange = parseInt(args.data.fl);
      let AtL1Change = this.L1AtDefault !== this.tempL1AtChange
      let AtL2Change = this.L2AtDefault !== this.tempL2AtChange
      let AtFLChange = this.FLAtDefault !== this.tempFLAtChange



      if(AtL1Change) {

        if(args.data.l1ID > 0) {
          const model = {
            ID: args.data.l1ID,
            Point: args.data.l1
          }
          const data = this.dataAtScorePicked.filter(x => x.ID === args.data.l1ID);
          if(data.length === 0) {
            this.dataAtScorePicked.push(model)
          } else {
            for (const item of data) {
              for (var i = 0; i < data.length; i++) {
                if (item.ID === args.data.l1ID) {
                  item.Point = args.data.l1;
                  break;
                }
              }
            }
          }
        }

      }

      if(AtL2Change) {

        if(args.data.l2ID > 0) {
          const model = {
            ID: args.data.l2ID,
            Point: args.data.l2
          }
          const data = this.dataAtScorePicked.filter(x => x.ID === args.data.l2ID);
          if(data.length === 0) {
            this.dataAtScorePicked.push(model)
          } else {
            for (const item of data) {
              for (var i = 0; i < data.length; i++) {
                if (item.ID === args.data.l2ID) {
                  item.Point = args.data.l2;
                  break;
                }
              }
            }
          }
        }

      }

      if(AtFLChange) {

        if(args.data.flid > 0) {
          const model = {
            ID: args.data.flid,
            Point: args.data.fl
          }
          const data = this.dataAtScorePicked.filter(x => x.ID === args.data.flid);
          if(data.length === 0) {
            this.dataAtScorePicked.push(model)
          } else {
            for (const item of data) {
              for (var i = 0; i < data.length; i++) {
                if (item.ID === args.data.flid) {
                  item.Point = args.data.fl;
                  break;
                }
              }
            }
          }
        }

      }


    }

  }

  actionCompleteAtScore(args) {
    // if (args.requestType === 'beginEdit') {
    //   console.log(args);
    //   if (args.rowData?.q1ID === 0) {
    //     args.form.elements.namedItem('q2').focus(); // Set focus to the Target element
    //   }
    //   if (args.rowData?.q2ID === 0) {
    //     args.form.elements.namedItem('q1').focus(); // Set focus to the Target element
    //   }
    // }
  }

  actionBeginSpeScore(args) {
    if (args.requestType === 'beginEdit') {
      this.SpeCommentDefault = args.rowData.comment
    }
    if (args.requestType === 'save') {
      this.tempSpeChange = args.data.comment;
      let SpeChange = this.SpeCommentDefault.length < this.tempSpeChange.length
      || this.SpeCommentDefault.length > this.tempSpeChange.length;


      if(SpeChange) {

        if(args.data.id > 0) {
          const model = {
            ID: args.data.id,
            Content: args.data.comment
          }
          const data = this.dataSpeScorePicked.filter(x => x.ID === args.data.id);
          if(data.length === 0) {
            this.dataSpeScorePicked.push(model)
          } else {
            for (const item of data) {
              for (var i = 0; i < data.length; i++) {
                if (item.ID === args.data.id) {
                  item.Content = args.data.comment;
                  break;
                }
              }
            }
          }
        }

      }


    }

  }

  actionCompleteSpeScore(args) {
    // if (args.requestType === 'beginEdit') {
    //   console.log(args);
    //   if (args.rowData?.q1ID === 0) {
    //     args.form.elements.namedItem('q2').focus(); // Set focus to the Target element
    //   }
    //   if (args.rowData?.q2ID === 0) {
    //     args.form.elements.namedItem('q1').focus(); // Set focus to the Target element
    //   }
    // }
  }

  loadData() {
    this.service.getGHRData().subscribe(data => {
      console.log(data);
      this.data = data;
    });
  }
  openModal(data , model , name) {
    this.userid = data.id;
    if (name === "H1") {
      this.getGHRReportH1Info(data.id);
    }else {
      this.getGHRReportH2Info(data.id);
    }
    this.modalRef = this.modalService.open(model, { size: 'xl', backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.dataCommentPicked = []
      this.dataAtScorePicked = []
      this.dataSpeScorePicked = []
    }, (reason) => {
      this.dataCommentPicked = []
      this.dataAtScorePicked = []
      this.dataSpeScorePicked = []
    });

  }
  getHalfYearSetting() {
    this.columns =[];
    for (const month of this.halfYearSettingsData) {
      this.columns.push(
      { field: `${month}`,
        headerText: this.getMonthListInCurrentQuarter(month),
        month: month
      })
    }
  }
  getResultOfMonthData() {
    this.Resultcolumns =[];
    for (const month of this.halfYearSettingsData) {
      this.Resultcolumns.push(
      { field: `${month}`,
        headerText: this.ResultOfMonthData.filter(x=>x.month === month)[0]?.title || "N/A",
        month: month
      })
    }
  }
  getMonthListInCurrentQuarter(index) {

    const listMonthOfEachQuarter =
        [
        "Jan.",
        "Feb.","Mar.","Apr.",
        "May.","Jun.","Jul.",
        "Aug.","Sep.","Oct.",
        "Nov.","Dec."
       ]
    ;
    const listMonthOfCurrentQuarter = listMonthOfEachQuarter[index - 1];
    return listMonthOfCurrentQuarter;
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
  save() {
    this.updateAtScore()
    this.updateComment()
    this.updateSpe()
    this.alertify.success(MessageConstants.CREATED_OK_MSG);
    this.clearData()
    this.modalRef.close()
  }
  clearData() {
    this.dataCommentPicked = []
    this.dataAtScorePicked = []
    this.dataSpeScorePicked = []
  }
  updateComment() {
    this.service.ReportUpdateComment(this.dataCommentPicked).subscribe(res => {
    })
  }
  updateAtScore() {
    this.service.ReportUpdateAtScore(this.dataAtScorePicked).subscribe(res => {
    })
  }
  updateSpe() {
    this.service.ReportUpdateSpe(this.dataSpeScorePicked).subscribe(res => {
    })
  }
  getGHRReportH1Info(id) {
    this.service.getGHRReportH1Info(id).subscribe((data: any) => {
      this.detailH1 = data.h1;
      this.title = "H1：Q1-Q2"
      this.titles = "H1"
      this.detailH2 = data.h2;
      this.kpicommentH1 = data.kpicommentH1
      this.attitudecommentData = data.attitudecomment
      this.atScoreData = data.attitudeScore
      this.kpiScoreData = data.kpiScore
      this.specialScoreData = data.specialScore
      this.halfYearSettingsData = data.dataObjectH1[0].settings || []
      this.ResultOfMonthData = data.dataObjectH1[0].resultOfMonth || []
      this.gridDataH1 = data.dataObjectH1
      this.avg = data.avg
      this.h1Score = data.h1Score
      this.dept = data.dept
      this.name = data.name
      this.getHalfYearSetting();
      this.getResultOfMonthData();
    });
  }
  getGHRReportH2Info(id) {
    this.service.getGHRReportH2Info(id).subscribe((data: any) => {
      this.detailH1 = data.h1;
      this.title = "H2：Q3-Q4"
      this.titles = "H2"
      this.detailH2 = data.h2;
      this.kpicommentH1 = data.kpicommentH1
      this.attitudecommentData = data.attitudecomment
      this.atScoreData = data.attitudeScore
      this.kpiScoreData = data.kpiScore
      this.specialScoreData = data.specialScore
      this.halfYearSettingsData = data.dataObjectH1[0].settings || []
      this.ResultOfMonthData = data.dataObjectH1[0].resultOfMonth || []
      this.gridDataH1 = data.dataObjectH1
      this.avg = data.avg
      this.h1Score = data.h1Score
      this.dept = data.dept
      this.name = data.name
      this.getHalfYearSetting();
      this.getResultOfMonthData();
    });
  }
  exportExcel() {
    this.service.H1H2ExportExcel(this.userid).subscribe((data: any) => {
      const blob = new Blob([data],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'H1,H2 Report 季報表.xlsx';
      link.click();
    });
  }

  // end api
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
  }

}
