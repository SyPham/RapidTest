import { NgxSpinnerService } from 'ngx-spinner';
import { filter } from 'rxjs/operators';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ExcelExportProperties, GridComponent } from '@syncfusion/ej2-angular-grids';
import { RapidTestReportService } from 'src/app/_core/_service/rapid.test.report.service';
import { DatePipe } from '@angular/common';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { AccountTypeConstant } from 'src/app/_core/_constants';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-rapid-test-report',
  templateUrl: './rapid-test-report.component.html',
  styleUrls: ['./rapid-test-report.component.scss'],
  providers: [DatePipe]
})
export class RapidTestReportComponent implements OnInit {

  data: DataManager;
  toolbarOptions = ['ExcelExport', 'Add', 'Update', 'Edit', 'Delete', 'Cancel', 'Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  startDate: Date;
  endDate: Date;
  code: any;
  visible = false;
  sortSettings = { columns: [{ field: 'checkOutTime', direction: 'Descending' }] };
  @ViewChild('importModal', { static: true })
  importModal: TemplateRef<any>;
  modalReference: NgbModalRef;
  progress: number;
  file: any;
  excelDownloadUrl: any;
  apiUrl = environment.apiUrl.replace('/api', '') + 'images/Format-Expiry-Date.png';
  baseUrl = environment.apiUrl;
  searchOptions: { fields: string[]; operator: string; key: string; ignoreCase: boolean; };
  constructor(
    private service: RapidTestReportService,
    public datePipe: DatePipe,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit() {
    this.excelDownloadUrl = `${environment.apiUrl}Report/ExportEmployeeExcel`;
    const accountType = JSON.parse(localStorage.getItem('user'))?.accountType || '';
    if (accountType == AccountTypeConstant.SYSTEM) {
      this.visible = true;
    }
    this.endDate = new Date();
    this.startDate = new Date();
    this.loadData();


  }
  showModal() {
    this.modalReference = this.modalService.open(this.importModal, { size: 'xl', backdrop: 'static' , keyboard: false });
  }
  downloadExcel() {
    this.spinner.show();
    const fileName = `Rapid Test Report ${this.datePipe.transform(new Date(), 'MM-dd-yyyy')}`
    const date  = this.datePipe.transform(this.startDate, 'MM/dd/yyyy');
    this.service.exportExcel(date).subscribe((data: any) => {
      const downloadURL = window.URL.createObjectURL(data.body);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = fileName + '.xlsx';
      link.click();
      this.spinner.hide();
    }, () => this.spinner.hide());
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
    this.grid.showSpinner();
    const fileName = `Rapid Test Report ${this.datePipe.transform(new Date(), 'MM-dd-yyyy')}`;
    console.log(this.data.adaptor)
    const data = (this.data.dataSource.data as any ).map((x, index)=> {
      return {
        number: index + 1,
        code: x.code,
        department: x.department,
        fullName: x.fullName,
        gender: x.gender,
        birthDate:  this.datePipe.transform(x.birthDate, 'MM-dd-yyyy'),
        testKindId: x.testKindId,
        kindName: x.kindName,
        result: x.result,
        createdTime: this.datePipe.transform(x.createdTime, 'MM-dd-yyyy HH:mm'),
        expiryTime: this.datePipe.transform(x.expiryTime, 'MM-dd-yyyy HH:mm'),
        checkInTime: this.datePipe.transform(x.checkInTime, 'MM-dd-yyyy HH:mm'),
        checkOutTime: this.datePipe.transform(x.checkOutTime, 'MM-dd-yyyy HH:mm'),
        factoryEntryTime: this.datePipe.transform(x.factoryEntryTime, 'MM-dd-yyyy'),

      }
    });
    // const excelExportProperties: ExcelExportProperties = {
    //   fileName: fileName + '.xlsx',
    //   hierarchyExportMode: 'All'
    // };
    // this.grid.excelExport(excelExportProperties);
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
    const code = this.code || '';
    this.data = new DataManager({
      url: `${this.baseUrl}Report/Filter?date=${startDate}&code=${code}`,
      adaptor: new WebApiAdaptor
  });
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
  fileProgress(event) {
    this.file = event.target.files[0];
  }
  submitUser() {
    this.service.importExcel3(this.file
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('User successfully created!', event.body);
          setTimeout(() => {
            this.progress = 0;
            this.loadData();
            this.modalReference.close();
            this.alertify.success('The excel has been imported into system!');
          }, 1500);

      }
    }, error => {
      this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG)
    })
  }
  excelExportComplete(): void {
    this.grid.hideSpinner();
}
}
