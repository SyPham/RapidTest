import { filter } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { RapidTestReportService } from 'src/app/_core/_service/rapid.test.report.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-rapid-test-report',
  templateUrl: './rapid-test-report.component.html',
  styleUrls: ['./rapid-test-report.component.scss'],
  providers: [DatePipe]
})
export class RapidTestReportComponent implements OnInit {

  data = [];
  toolbarOptions = ['ExcelExport', 'Add', 'Update', 'Edit', 'Delete', 'Cancel', 'Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  startDate: Date;
  endDate: Date;
  code: any;
  constructor(
    private service: RapidTestReportService,
    public datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.endDate = new Date();
    this.startDate = new Date();
    this.loadData();
  }
  startDateOnchange(args) {
    this.startDate = (args.value as Date);
    this.filter();
  }
  endDateOnchange(args) {
    this.endDate = (args.value as Date);
    this.filter();
  }
  excelExport() {
    const fileName = `Rapid Test Report ${this.datePipe.transform(new Date(), 'MM-dd-yyyy')}`
    const excelExportProperties = {
      fileName: fileName + '.xlsx'
    };
    this.grid.excelExport(excelExportProperties);
  }
  filter() {
    this.loadData();
  }
  reset() {
    this.endDate = new Date();
    this.startDate = new Date();
    this.code = '';
    this.loadData();
  }
  loadData() {
    const startDate = this.startDate.toLocaleDateString();
    const endDate = this.endDate.toLocaleDateString();
    const code = this.code || '';
    this.service.filter(startDate, endDate, code).subscribe(
      (res) => {
      this.data = res;
      },
      (error) => {
        this.data = [];
      }
    );
  }
}
