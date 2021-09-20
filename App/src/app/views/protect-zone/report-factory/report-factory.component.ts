import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-report-factory',
  templateUrl: './report-factory.component.html',
  styleUrls: ['./report-factory.component.scss']
})
export class ReportFactoryComponent implements OnInit {
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
