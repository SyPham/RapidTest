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
  toolbarOptions = ['ExcelExport', 'Search'];
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 12 };
  @ViewChild('grid') public grid: GridComponent;
  excelDownloadUrl: string;
  modalReference: NgbModalRef;
  file: any;
  @ViewChild('importModal', { static: true })
  importModal: TemplateRef<any>;
  selectOptions = { persistSelection: true };
  selectedData: Employee[] = [];
  displayTextMethod: DisplayTextModel = {
    visibility: true
  };
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
  loadData() {
    this.spinner.show();
    this.service.getAll().subscribe(data => {
      this.data = data;
      this.spinner.hide();
    }, (err) => this.spinner.hide());
  }
  onChange(args, data) {
    console.log(args);
    data.seaInform = args.checked;
    this.toggleSEAInform(data.id, (res)=> {
      if (res.success === true) {
        const message = res.message;
        const item = res.data;
        const dataSource = this.grid.dataSource as Employee[];
        const index = dataSource.findIndex(x=> x.id == item.id);
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
      });
  }
  checkBoxChange(args) {
    console.log(args);
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
        page-break-after: always;
        clear: both;
      }
      .content .qrcode {
        float:left;
        width: 100px;
        margin-top: 10px;
        padding: 0;
        margin-left: 0px;
      }
      .content .info {
        float:left;
        list-style: none;
        width: 200px;
      }
      .content .info ul {
        float:left;
        list-style: none;
        padding: 0px;
        margin: 0px;
        margin-top: 40px;
        font-weight: bold;
        word-wrap: break-word;
      }
      @page {
        size: 2.65 1.20 in;
        page-break-after: always;
        margin: 0;
      }
      @media print {
        html, body {
          width: 90mm; // Chi co nhan millimeter
        }
      }
    </style>
    <body onload="window.print(); window.close()">
      ${html}
    </body>
  </html>
  `);
    WindowPrt.document.close();
    this.refresh();
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
        <div class='info'>
       </div>
    </div>
    `;
    }
    this.configurePrint(html);
  }
}
