import { Employee } from './../../../_core/_model/employee';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent, SelectionService } from '@syncfusion/ej2-angular-grids';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { EmployeeService } from 'src/app/_core/_service/employee.service';
import { environment } from 'src/environments/environment';
import { DisplayTextModel } from '@syncfusion/ej2-angular-barcode-generator';
import { MessageConstants } from 'src/app/_core/_constants/system';
import { SettingService } from 'src/app/_core/_service/setting.service';
import { Setting } from 'src/app/_core/_model/setting';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-staff-info',
  templateUrl: './staff-info.component.html',
  styleUrls: ['./staff-info.component.scss'],
  providers: [SelectionService],
  encapsulation: ViewEncapsulation.None
})
export class StaffInfoComponent implements OnInit {
  data;
  toolbarOptions = ['ExcelExport','Search', 'Add',  {
    text: 'Filter Off',
    tooltipText: 'Filter Off',
    prefixIcon: 'fa fa-check',
    id: 'printoff',
  },
  {
  text: 'All',
  tooltipText: 'All',
  prefixIcon: 'fa fa-list',
  id: 'all',
}
];
  pageSettings = { pageCount: 20, pageSizes: [12, 20, 50, 100, 150, "All"], pageSize: 12 };
  @ViewChild('grid') public grid: GridComponent;
  excelDownloadUrl: string;
  modalReference: NgbModalRef;
  file: any;
  file2: any;
  @ViewChild('importModal', { static: true })
  importModal: TemplateRef<any>;
  @ViewChild('import2Modal', { static: true })
  import2Modal: TemplateRef<any>;2
  selectOptions = { persistSelection: true };
  selectedData: Employee[] = [];
  genderData = ["NAM", "NỮ"];
  displayTextMethod: DisplayTextModel = {
    visibility: false
  };
  createModel: Employee;
  editModel: Employee;
  editSettings = { showDeleteConfirmDialog: false, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
  seaInform = true;
  gender = "";
  isPrint = "OFF";
  isPrintData = ["ON", "OFF"];
  disable = true;
  loading = 1;
  settingId: number;
  settingData: Setting[];
  settingFields: object = { text: 'name', value: 'id' };
  excel2DownloadUrl: string;
  excel3DownloadUrl: string;
  progress = 0;
  showClose = true;
  constructor(
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private service: EmployeeService,
    private serviceSetting: SettingService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.excelDownloadUrl = `${environment.apiUrl}Employee/ExcelExport`;
    this.excel2DownloadUrl = `${environment.apiUrl}Employee/ExcelExportTemplate`;
    this.excel3DownloadUrl = `${environment.apiUrl}Employee/ExportEmployeeExcel`;
    this.loadSettingData();
    this.loadData();
  }

  showModal() {
    this.modalReference = this.modalService.open(this.importModal, { size: 'xl', backdrop: 'static' , keyboard: false });
  }
  showModal2() {
    this.modalReference = this.modalService.open(this.import2Modal, { size: 'xl', backdrop: 'static', keyboard: false });
  }
  fileProgress(event) {
    this.file = event.target.files[0];
  }
  fileProgress2(event) {
    this.file2 = event.target.files[0];
  }
  submitUser() {
    this.service.importExcel3(this.file2
    ).subscribe((event: HttpEvent<any>) => {
      this.showClose = false;
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
            this.showClose = true;

            this.loadData();
            this.modalReference.close();
            this.alertify.success('The excel has been imported into system!');
          }, 1500);

      }
    }, error => {
      this.showClose = true;
      this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG)
    })
  }
  toggleSEAInform(id, callBack): void {
    this.service.toggleSEAInform(id).subscribe(
      (res) => {
        callBack(res);
      },
      (err) => this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG)
    );
  }

  loadPrintData(args) {
    const dataSource = this.grid.getSelectedRecords() as Employee[];
    if (dataSource.length >= 150 && args.checked) {
      this.selectedData = dataSource.slice(0, 150);
      this.loading = 0;
      this.alertify.message('Vui lòng đợi ít nhất 10 giây để hệ thống tạo ra 150 mã QR Code', true);
      setTimeout(() => {
        this.loading = 2;
        this.disable = false;}, 10000);
    } else {
      this.loading = 1;
      this.disable = false;
      this.selectedData = dataSource;
    }
  }
  loadData() {
    this.spinner.show();
    this.service.getAll().subscribe(data => {
      this.data = data;
      this.spinner.hide();
    }, (err) => this.spinner.hide());
  }
  loadSettingData() {
    this.serviceSetting.getAll().subscribe(data => {
      this.settingData = data.filter(x=> x.settingType == 'CHECK_OUT');
    }, (err) => this.spinner.hide());
  }
  loadPrintOffData() {
    this.spinner.show();
    this.service.getPrintOff().subscribe(data => {
      this.data = data;
      this.spinner.hide();
    }, (err) => this.spinner.hide());
  }
  updateIsPrint() {
    const ids = this.selectedData.map(x=> x.id);
    const model = {
      ids: ids,
      printBy: JSON.parse(localStorage.getItem('user')).id
    };
    this.service.updateIsPrint(model).subscribe(data => {
      this.loadPrintOffData();
      this.refresh();
      this.selectedData = [];
    }, (err) => this.alertify.warning("Faild to update print!"));
  }
  onChange(args, data) {
    console.log(args);
    data.seaInform = args.checked;
    this.toggleSEAInform(data.id, (res) => {
      if (res.success === true) {
        const message = res.message;
        const item = res.data;
        const dataSource = this.grid.dataSource as Employee[];
        const index = dataSource.findIndex(x => x.id == item.id);
        dataSource[index].seaInform = args.checked;
        this.grid.refresh();
        this.refresh();
        this.alertify.success(message);
      } else {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    })
  }

  toolbarClick(args) {
    switch (args.item.id) {
      case 'grid_excelexport':
        this.grid.excelExport({ hierarchyExportMode: 'All' });
        break;
        case 'grid_ExcelExport2':
          this.downloadExcel();
          break;
        case 'printoff':
          this.loadPrintOffData();
          break;
          case 'all':
            this.loadData();
            break;
      default:
        break;
    }
  }
   downloadExcel() {
    this.service.exportExcel().subscribe((data: any) => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      const y = new Date().getFullYear();
      const d = new Date().getDay();
      const m = new Date().getMonth() + 1;
      link.download = `employee${m}${d}${y}.xlsx`;
      link.click();
    });
  }

  uploadFile() {
    this.spinner.show();
    this.service
      .importExcel(this.file)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.loadData();
        this.modalReference.close();
        this.alertify.success('The excel has been imported into system!');
      }, err => {
        this.spinner.hide();
        this.alertify.error('Failed to upload!', true);
      });
  }
  checkBoxChange(args) {
    console.log(args);
    this.loadPrintData(args);
  }
  rowSelected(args) {
    const dataSource = this.grid.getSelectedRecords() as Employee[];
    this.selectedData = dataSource;
  }
  printQRCode() {
    const dataSource = this.grid.getSelectedRecords() as Employee[];
    this.selectedData = dataSource;
  }
  refresh() {
    this.grid.clearSelection();
    const dataSource = this.grid.getSelectedRecords() as Employee[];
    this.selectedData = dataSource;
  }

  configurePrint(html) {
    const WindowPrt = window.open('', '_blank', 'left=0,top=0,width=1000,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(`
  <html>
    <head>
    </head>
    <style>
      * {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
      }
      .content {
        // page-break-after: always;
        width:30%;
        float:left;

      }
      .content .qrcode {
        width: 120px;
        margin-top: 10px;
        padding: 0;
        margin-left: 0px;
      }
      .label {
        padding-left: 15px;
      }
      @page {

      }
      @media print {

      }
    </style>
    <body onload="window.print(); window.close()">
      ${html}
    </body>
  </html>
  `);
    WindowPrt.document.close();
    this.updateIsPrint();
  }
  printData() {
    let html = '';
    const dataSource = this.selectedData;

    for (const item of dataSource) {
      const content = document.getElementById(item.code);
      html += `
     <div class='content'>
      <div class='qrcode'>
       ${content.innerHTML}
       </div>
       <div class="label">
       #:${item.code} ${item.department}
       </div>
    </div>
    `;
    }
    this.configurePrint(html);
  }

  actionBegin(args) {
    if (args.requestType === 'beginEdit') {
      const data = args.rowData;
      this.gender = data.gender || '';
      this.isPrint = data.isPrint || 'OFF';
      this.seaInform = data.seaInform;
      this.settingId = data.settingId || null;
    }
    if (args.requestType === 'save' && args.action === 'add') {
      this.createModel = {
        id: 0,
        fullName: args.data.fullName,
        code: args.data.code,
        factoryName: args.data.factoryName,
        gender: this.gender,
        isPrint: this.isPrint,
        settingId: this.settingId,
        birthDate: "",
        birthDay: (args.data.birthDate as Date).toLocaleDateString(),
        department: args.data.department,
        factoryId: args.data.factoryId || 0,
        seaInform: this.seaInform,
        createdBy: JSON.parse(localStorage.getItem('user')).id,
        createdTime: new Date().toLocaleDateString(),
        modifiedBy: 0,
        modifiedTime: null,
        testDate: args.data.testDate,
        departmentId: args.data.departmentId || 0,
      };

      if (args.data.fullName === undefined) {
        this.alertify.error('Please key in a fullName! <br> Vui lòng nhập họ và tên!');
        args.cancel = true;
        return;
      }
      if (args.data.factoryName === undefined) {
        this.alertify.error('Please key in a factory! <br> Vui lòng nhập nhà máy!');
        args.cancel = true;
        return;
      }
      if (args.data.department === undefined) {
        this.alertify.error('Please key in a department! <br> Vui lòng nhập đơn vị!');
        args.cancel = true;
        return;
      }
      this.create();
    }
    if (args.requestType === 'save' && args.action === 'edit') {
      this.editModel = {
        id: args.data.id,
        fullName: args.data.fullName,
        code: args.data.code,
        factoryName: args.data.factoryName,
        department: args.data.department,
        factoryId: args.data.factoryId,
        seaInform: this.seaInform,
        isPrint: this.isPrint,
        gender: this.gender,
        settingId: this.settingId,
        birthDay: (args.data.birthDate as Date).toLocaleDateString(),
        birthDate: args.data.birthDate,
        createdBy: args.data.createdBy,
        createdTime: args.data.createdTime,
        modifiedBy: JSON.parse(localStorage.getItem('user')).id,
        modifiedTime: new Date().toLocaleDateString(),
        departmentId: args.data.departmentId,
        testDate: args.data.testDate,
      };
      this.update().subscribe(
        (res) => {
          if (res.success === true && res.statusCode == 200) {
            this.alertify.success(MessageConstants.UPDATED_OK_MSG);
            args.data = res.data;
            this.grid.updateRow(args.index, res.data);
            this.editModel = {} as Employee;
            this.gender = "";
            this.seaInform = true;
          } else{
            this.alertify.warning(res.message, true);
            this.grid.updateRow(args.index, args.data);

            this.editModel = {} as Employee;
            this.gender = "";
            this.seaInform = true;

          }
        },
        (error) => {
          this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
        }
      );;
    }
    if (args.requestType === 'delete') {
      this.delete(args.data[0].id);
    }
  }
  delete(id) {
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

  }
  create() {
    this.service.add(this.createModel).subscribe(
      (res) => {
        if (res.success === true && res.statusCode == 200) {
          this.alertify.success(MessageConstants.CREATED_OK_MSG);
          this.loadData();
          this.createModel = {} as Employee;
          this.gender = "";
          this.isPrint = "OFF";
          this.seaInform = true;
        } else {
          this.alertify.warning(res.message, true);
          this.loadData();
          this.createModel = {} as Employee;
          this.gender = "";
          this.isPrint = "OFF";
          this.seaInform = true;
        }

      },
      (error) => {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    );
  }
  update() {
    return this.service.update(this.editModel)
  }
}
