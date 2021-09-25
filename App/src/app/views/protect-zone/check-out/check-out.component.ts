import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TestKind } from 'src/app/_core/_model/test-kind';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { RapidTestReportService } from 'src/app/_core/_service/rapid.test.report.service';
import { TestKindService } from 'src/app/_core/_service/test.kind.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit, OnDestroy {
  test: any = 'form-control w3-light-grey';
  subject = new Subject<string>();
  subscription: Subscription[] = [];
  kindId: any;
  testKindData: TestKind[];
  QRCode: string;
  success = 0;
  fullName: any;
  constructor(
    private alertify: AlertifyService,
    private service: RapidTestReportService,
    private serviceTestKind: TestKindService
  ) { }
  ngOnDestroy(): void {
    this.subscription.forEach(item => item.unsubscribe());
  }
  ngOnInit() {
    this.loadData();
    this.checkQRCode();
  }
  loadData() {
    this.serviceTestKind.getAll().subscribe(data => {
      this.testKindData = data;
      this.kindId = this.testKindData.filter(x=> x.isDefault)[0].id || 0;
      console.log(data);
    });
  }
  // sau khi scan input thay doi
  async onNgModelChangeScanQRCode(args) {
    this.QRCode = args;
    this.subject.next(args);
  }
  private checkQRCode() {
    this.subscription.push(this.subject
      .pipe(debounceTime(500))
      .subscribe(async (res) => {
        this.QRCode = res;
          this.scanQRCode();
      }));
  }
  scanQRCode() {
    const model = {
      kindId: this.kindId,
      qrCode: this.QRCode
    };
    this.service.scanQRCode(model).subscribe(
      (res) => {
        this.success = res.statusCode;
        if (res.success === true && res.statusCode == 200) {
          this.fullName = res.data.fullName;
        }
      },
      (error) => {
      }
    );
  }
}
