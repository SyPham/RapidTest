import { Component, OnInit, ViewChild } from '@angular/core';
import { ExcelExportProperties, ExcelQueryCellInfoEventArgs, GridComponent } from '@syncfusion/ej2-angular-grids';
import { DatePipe } from '@angular/common';
import { RecordErrorService } from 'src/app/_core/_service/record-error.service';

@Component({
  selector: 'app-access-failed',
  templateUrl: './access-failed.component.html',
  styleUrls: ['./access-failed.component.scss'],
  providers: [DatePipe]
})
export class AccessFailedComponent implements OnInit {

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
        code: x.code,
        fullName: x.fullName,
        department: x.department,
        gender: x.gender,
        station: x.station,
        errorKind: x.errorKind,
        createdTime: this.datePipe.transform(x.createdTime, 'MM-dd-yyyy HH:mm'),
        lastCheckInDateTime: this.datePipe.transform(x.lastCheckInDateTime, 'MM-dd-yyyy HH:mm'),
        lastCheckOutDateTime: this.datePipe.transform(x.lastCheckOutDateTime, 'MM-dd-yyyy HH:mm'),
      }
    });


  const fileName = `Access failed ${this.datePipe.transform(new Date(), 'MM-dd-yyyy')}.xlsx`
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
      this.data = res;
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
