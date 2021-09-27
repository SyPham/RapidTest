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

@Component({
  selector: 'app-staff-info',
  templateUrl: './staff-info.component.html',
  styleUrls: ['./staff-info.component.scss'],
  providers: [SelectionService],
  encapsulation: ViewEncapsulation.None
})
export class StaffInfoComponent implements OnInit {
  data;
  toolbarOptions = ['ExcelExport', 'Search', 'Add'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 12 };
  @ViewChild('grid') public grid: GridComponent;
  excelDownloadUrl: string;
  modalReference: NgbModalRef;
  file: any;
  @ViewChild('importModal', { static: true })
  importModal: TemplateRef<any>;
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
  isPrint = "";
  isPrintData = ["ON", "OFF"];
  constructor(
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private service: EmployeeService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.excelDownloadUrl = `${environment.apiUrl}Employee/ExcelExport`;
    this.loadData();
  }

  showModal() {
    this.modalReference = this.modalService.open(this.importModal, { size: 'xl' });
  }
  fileProgress(event) {
    this.file = event.target.files[0];
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
      this.alertify.warning('Vui lòng chỉ in tối đa 150 dòng dữ liệu!', true);
      this.grid.refresh();
      this.grid.clearSelection();
      this.selectedData = [];

    } else {
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
  updateIsPrint() {
    const ids = this.selectedData.map(x=> x.id);
    const model = {
      ids: ids,
      printBy: JSON.parse(localStorage.getItem('user')).id
    };
    this.service.updateIsPrint(model).subscribe(data => {
      this.loadData();
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
      default:
        break;
    }
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
    this.selectedData = this.grid.getSelectedRecords() as Employee[];
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
    if (args.requestType === 'add') {
    }
    if (args.requestType === 'beginEdit') {
      const data = args.rowData;
      this.gender = data.gender || '';
      this.isPrint = data.isPrint || '';
      this.seaInform = data.seaInform;
    }
    if (args.requestType === 'save' && args.action === 'add') {
      this.createModel = {
        id: 0,
        fullName: args.data.fullName,
        code: args.data.code,
        factoryName: args.data.factoryName,
        gender: this.gender,
        isPrint: this.isPrint,
        birthDate: "",
        birthDay: (args.data.birthDate as Date).toLocaleDateString(),
        department: args.data.department,
        factoryId: args.data.factoryId || 0,
        seaInform: this.seaInform,
        createdBy: JSON.parse(localStorage.getItem('user')).id,
        createdTime: new Date().toLocaleDateString(),
        modifiedBy: 0,
        modifiedTime: null,
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
        birthDay: (args.data.birthDate as Date).toLocaleDateString(),
        birthDate: args.data.birthDate,
        createdBy: args.data.createdBy,
        createdTime: args.data.createdTime,
        modifiedBy: JSON.parse(localStorage.getItem('user')).id,
        modifiedTime: new Date().toLocaleDateString(),
        departmentId: args.data.departmentId,
      };
      this.update();
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
        if (res.success === true) {
          this.alertify.success(MessageConstants.CREATED_OK_MSG);
          this.loadData();
          this.createModel = {} as Employee;
          this.gender = "";
          this.seaInform = true;
        } else {
          this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
        }

      },
      (error) => {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    );
  }
  update() {
    this.service.update(this.editModel).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(MessageConstants.UPDATED_OK_MSG);
          this.loadData();
          this.createModel = {} as Employee;
          this.gender = "";
          this.seaInform = true;
        } else {
          this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
        }
      },
      (error) => {
        this.alertify.warning(MessageConstants.SYSTEM_ERROR_MSG);
      }
    );
  }
}
