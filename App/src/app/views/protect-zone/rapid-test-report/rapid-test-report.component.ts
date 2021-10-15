import { filter } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { RapidTestReportService } from 'src/app/_core/_service/rapid.test.report.service';
import { DatePipe } from '@angular/common';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { AccountTypeConstant } from 'src/app/_core/_constants';

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
  visible = false;
  sortSettings = { columns: [{ field: 'checkOutTime', direction: 'Descending' }] };

  constructor(
    private service: RapidTestReportService,
    public datePipe: DatePipe,
    private alertify: AlertifyService,

  ) { }

  ngOnInit() {
    const accountType = JSON.parse(localStorage.getItem('user'))?.accountType || '';
    if (accountType == AccountTypeConstant.SYSTEM) {
      this.visible = true;
    }
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
    const endDate = this.startDate.toLocaleDateString();
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

  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
  }
  delete(id) {
    this.alertify.confirm('Delete', 'Are you sure you want to delete this record "' + id + '" ?', () => {
      this.service.delete(id).subscribe(
        (res) => {
          if (res.success === true) {
            this.alertify.success(MessageConstants.DELETED_OK_MSG);
            this.loadData();
          } else {
             this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
          }
        },
        (err) => this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG)
      );
    });


  }
}
