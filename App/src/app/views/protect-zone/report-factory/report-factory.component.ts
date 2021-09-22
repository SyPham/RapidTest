import { FactoryReportService } from 'src/app/_core/_service/factory.report.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-report-factory',
  templateUrl: './report-factory.component.html',
  styleUrls: ['./report-factory.component.scss']
})
export class ReportFactoryComponent implements OnInit {

  data = [];
  toolbarOptions = ['ExcelExport', 'Add', 'Update', 'Edit', 'Delete', 'Cancel', 'Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  startDate: Date;
  endDate: Date;
  code: any;
  constructor(
    private service: FactoryReportService
  ) { }

  ngOnInit() {
    this.endDate = new Date();
    this.startDate = new Date();
    this.loadData();
  }
  startDateOnchange(args) {
    this.startDate = (args.value as Date);
    //this.search(this.startDate, this.endDate);
  }
  endDateOnchange(args) {
    this.endDate = (args.value as Date);
    //this.search(this.startDate, this.endDate);
    this.filter();
  }
  excelExport() {
    this.grid.excelExport();
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
