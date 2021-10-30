import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
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
  sortSettings = { columns: [{ field: 'checkInTime', direction: 'Descending' }] };

  constructor(
    private service: RecordErrorService,
    public datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.loadData();
  }
  dataBound() {
    this.grid.autoFitColumns();
  }
  excelExport() {
    const fileName = `Record-error ${this.datePipe.transform(new Date(), 'MM-dd-yyyy')}`
    const excelExportProperties = {
      fileName: fileName + '.xlsx'
    };
    this.grid.excelExport(excelExportProperties);
  }


  loadData() {
    this.service.getAccessFailed().subscribe(
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
