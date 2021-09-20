import { AccountGroup } from './../../../../_core/_model/account.group';
import { BaseComponent } from 'src/app/_core/_component/base.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/_core/_service/report.service';

@Component({
  selector: 'app-hq-hr-report',
  templateUrl: './hq-hr-report.component.html',
  styleUrls: ['./hq-hr-report.component.scss']
})
export class HqHrReportComponent extends BaseComponent implements OnInit {
  data: any[] = [];
  modalReference: NgbModalRef;
  pageSettings = { pageCount: 20, pageSizes: true, pageSize: 10 };
  @ViewChild('grid') public grid: GridComponent;
  accountCreate: AccountGroup;
  accountUpdate: AccountGroup;
  setFocus: any;
  locale = localStorage.getItem('lang');
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: false, allowDeleting: false, mode: 'Normal' };
  toolbarOptions = ['Search'];

  constructor(
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private service: ReportService,
    private route: ActivatedRoute,
  ) { super(); }

  ngOnInit() {
    this.loadData();
  }

  onDoubleClick(args: any): void {
  }
  actionBegin(args) {
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
  actionComplete(args) {
  }

  // end life cycle ejs-grid

  // api

  loadData() {
    this.service.geH1H2Data().subscribe(data => {
      this.data = data;
    });
  }
  // end api
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.pageSettings.pageSize + Number(index) + 1;
  }

}
