import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-rapid-test-report',
  templateUrl: './rapid-test-report.component.html',
  styleUrls: ['./rapid-test-report.component.scss']
})
export class RapidTestReportComponent implements OnInit {

  data = [];
  toolbarOptions = ['ExcelExport', 'Add', 'Update','Edit', 'Delete', 'Cancel', 'Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  startDate: Date;
  endDate: Date;
  constructor() { }

  ngOnInit() {
    this.endDate = new Date();
    this.startDate = new Date();
  }
  startDateOnchange(args) {
    this.startDate = (args.value as Date);
    //this.search(this.startDate, this.endDate);
  }
  endDateOnchange(args) {
    this.endDate = (args.value as Date);
    //this.search(this.startDate, this.endDate);
  }

}
