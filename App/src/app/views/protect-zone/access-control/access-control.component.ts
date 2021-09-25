import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { FactoryReportService } from 'src/app/_core/_service/factory.report.service';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.scss']
})
export class AccessControlComponent implements OnInit, OnDestroy {
  test: any = 'form-control w3-light-grey';
  subject = new Subject<string>();
  subscription: Subscription[] = [];
  QRCode: string;
  success = 0;
  fullName: any;
  constructor(
    private alertify: AlertifyService,
    private service: FactoryReportService
  ) { }
  ngOnDestroy(): void {
    this.subscription.forEach(item => item.unsubscribe());
  }
  ngOnInit() {
    this.checkQRCode();
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
    this.service.accessControl(this.QRCode).subscribe(
      (res) => {
        this.success = res.statusCode;
        if (res.success && res.statusCode == 200) {
          this.fullName = res.data.fullName;
        }
      },
      (error) => {
        this.success = 0;
      }
    );
  }
}
