import { Component, OnInit, ViewChild } from '@angular/core';
import { ExcelExportProperties, ExcelQueryCellInfoEventArgs, GridComponent } from '@syncfusion/ej2-angular-grids';
import { DatePipe } from '@angular/common';
import { RecordErrorService } from 'src/app/_core/_service/record-error.service';

@Component({
  selector: 'app-record-error',
  templateUrl: './record-error.component.html',
  styleUrls: ['./record-error.component.scss'],
  providers: [DatePipe]
})
export class RecordErrorComponent implements OnInit {

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

    const data = this.data.map((x, index)=> {
      return {
        number: index + 1,
        code: x.code || "N/A",
        fullName: x.fullName || "N/A",
        department: x.department || "N/A",
        gender: x.gender || "N/A",
        station: x.station || "N/A",
        kind: x.kind || "N/A",
        errorKind: x.errorKind.replace('<br />','\r\n' ),
        createdTime: this.datePipe.transform(x.createdTime, 'MM-dd-yyyy HH:mm') || "N/A"
      }
    });

  const fileName = `Record error ${this.datePipe.transform(new Date(), 'MM-dd-yyyy')}.xlsx`
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
    const date = this.date.toLocaleDateString();
    this.service.filterRecordError(date).subscribe(
      (res) => {
      this.data = res.map((x, index)=> {
        return {
          id: x.id,
          code: x.code || "N/A",
          fullName: x.fullName || "N/A",
          department: x.department || "N/A",
          gender: x.gender || "N/A",
          station: x.station || "N/A",
          kind: x.kind || "N/A",
          errorKind: x.errorKind.replace('\r\n', '<br />'),
          createdTime: x.createdTime
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
