import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CellModel, getCell, SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { PerformanceService } from 'src/app/_core/_service/performance.service';

@Component({
  selector: 'app-upload-kpi',
  templateUrl: './upload-kpi.component.html',
  styleUrls: ['./upload-kpi.component.scss'],
  providers: [DatePipe]
})
export class UploadKpiComponent implements OnInit {
  data: any;
  originalData: any;
  @ViewChild('remoteDataBinding')
  public spreadsheetObj: SpreadsheetComponent;

  constructor(private service: PerformanceService,
    private datePipe: DatePipe,
    private alertify: AlertifyService,
    ) { }

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.service.getKPIObjectivesByUpdater().subscribe(res => {
      this.data = res.data.map(item => {
        return {
          objectiveName: item.objectiveName,
          percentage: item.percentage,
          createdTime: item.createdTime === '0001-01-01T00:00:00' ? "" : this.datePipe.transform(item.createdTime, "yyyy-MM-dd HH:mm:ss")
        }
      });
      this.originalData = res.data;
    });
  }
  contextMenuBeforeOpen(args) {
    console.log(args);
    if (args.element.id === this.spreadsheetObj.element.id + '_contextmenu') {
      this.spreadsheetObj.removeContextMenuItems(["Paste"], false);
      this.spreadsheetObj.removeContextMenuItems(["Paste Special"], false);
      this.spreadsheetObj.removeContextMenuItems(["Cut"], false);
      this.spreadsheetObj.removeContextMenuItems(["Copy"], false);
    }
  }

  async submit() {

    let index = 2;
    const results = [];
    for(var i = 0 ; i < this.originalData.length ; i++) {
    console.log(this.spreadsheetObj.getRowData(i + 1, 0)); // to provide the cell model
        const data = this.spreadsheetObj.getRowData(i + 1, 0) as any;
        const objective = data[0].objectiveName;
        const percentage = data[0].percentage;
        const itemResult = this.originalData.filter((x: any) => x.objectiveName == objective)[0] as any;
        itemResult.percentage = percentage;
        results.push(itemResult);
    }
    console.log(results);
    // for (const item of this.originalData) {
    //   const data = await this.spreadsheetObj.getData(`A${index}:C${index}`);
    //   let objective = '';
    //   let percentage = '';
    //   for (const a of data) {
    //     if (a[0] === `A${index}`) {
    //       objective = a[1].value;
    //     }
    //     if (a[0] === `B${index}`) {
    //       percentage = a[1].value;
    //     }
    //   }

    //   const itemResult = this.originalData.filter((x: any) => x.objectiveName == objective)[0] as any;
    //   itemResult.percentage = percentage;
    //   results.push(itemResult);
    //   index++;
    // }
    if (results.length === 0) {
      this.alertify.warning('Not yet complete. Can not submit! 尚未完成，無法提交', true);
      return;
    }
    // console.log(results);
    this.service.submit(results).subscribe(response => {
      console.log(response)
      if (response.success) {
        this.alertify.success(MessageConstants.CREATED_OK_MSG);
        this.loadData();
      } else {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    }, () => this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG))

  }
}
