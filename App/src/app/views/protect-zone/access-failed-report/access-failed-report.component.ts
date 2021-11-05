import { Component, OnInit, ViewChild } from '@angular/core';
import { ExcelExportProperties, ExcelQueryCellInfoEventArgs, GridComponent } from '@syncfusion/ej2-angular-grids';
import { DatePipe } from '@angular/common';
import { RecordErrorService } from 'src/app/_core/_service/record-error.service';

@Component({
  selector: 'app-access-failed-report',
  templateUrl: './access-failed-report.component.html',
  styleUrls: ['./access-failed-report.component.scss'],
  providers: [DatePipe]
})
export class AccessFailedReportComponent implements OnInit {

  data = [];
  toolbarOptions = ['Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  sortSettings = { columns: [{ field: 'createdTime', direction: 'Descending' }] };
  date: Date;

  constructor(
    private service: RecordErrorService,
    public datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.date = new Date();
    this.loadData();
  }
  dateOnchange(args) {
    this.date = (args.value as Date);
    this.filter();
  }
  excelQueryCellInfo(args: ExcelQueryCellInfoEventArgs) {
    args.style =  {
      wrapText :true,
      hAlign: 'Center',
      vAlign: 'Center'
    };
    if (args.column.field == "errorKind") {
      args.style.hAlign = 'Left';
    }
  }
  excelExport() {

    const data = this.data.filter(x=> x.code != null).map((x, index)=> {
      return {
        number: index + 1,
        code: x.code || "N/A",
        fullName: x.fullName || "N/A",
        department: x.department || "N/A",
        gender: x.gender || "N/A",
        errorKind: x.errorKind.replace('<br />','\r\n' ),
        createdTime: this.datePipe.transform(x.createdTime, 'MM-dd-yyyy HH:mm'),
        lastCheckInDateTime: x.lastCheckInDateTime || "N/A",
        lastCheckOutDateTime: x.lastCheckOutDateTime || "N/A",
        entryFactoryExpiryTime: x.entryFactoryExpiryTime || "N/A",

      }
    });


  const fileName = `Access failed Report ${this.datePipe.transform(new Date(), 'MM-dd-yyyy')}.xlsx`
  const excelExportProperties: ExcelExportProperties = {
    dataSource: data,
    hierarchyExportMode: 'All',
    fileName: fileName
};
  this.grid.excelExport(excelExportProperties);
  }

  dataBound() {
    this.grid.autoFitColumns();
  }
  reset() {
    this.date = new Date();
    this.loadData();
  }
  filter() {
    this.loadData();
  }
  loadData() {
    const date = this.datePipe.transform(this.date, 'MM-dd-yyyy');
    this.service.filterAccessFailed(date).subscribe(
      (res) => {
      this.data = res.filter(x=> x.code != null).map((x, index)=> {
        return {
          code: x.code || "N/A",
          fullName: x.fullName || "N/A",
          department: x.department || "N/A",
          gender: x.gender || "N/A",
          errorKind: x.errorKind.replace('\r\n', '<br />'),
          createdTime: x.createdTime,
          lastCheckInDateTime:  this.datePipe.transform(x.lastCheckInDateTime, 'MM-dd-yyyy HH:mm') || "N/A",
        lastCheckOutDateTime: this.datePipe.transform(x.lastCheckOutDateTime, 'MM-dd-yyyy HH:mm') || "N/A",
        entryFactoryExpiryTime: this.datePipe.transform(x.entryFactoryExpiryTime, 'MM-dd-yyyy HH:mm') || "N/A",

        }
      });

      },
      (error) => {
        this.data = [];
      }
    );
  }


  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
  }

}
