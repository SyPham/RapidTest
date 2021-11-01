import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Employee } from 'src/app/_core/_model/employee';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { FactoryReportService } from 'src/app/_core/_service/factory.report.service';
import { environment } from 'src/environments/environment';

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
  message = '';
  fullName: any;
  switchColor = false;
  total = 0;
  employeeData :Employee;
  successBeepUrl = environment.apiUrl.replace('api/', '') + 'audio/successBeep.mp3';
  errorBeepUrl= environment.apiUrl.replace('api/', '') + 'audio/errorBeep.mp3';
  constructor(
    private alertify: AlertifyService,
    private service: FactoryReportService
  ) { }
  ngOnDestroy(): void {
    this.subscription.forEach(item => item.unsubscribe());
  }
  ngOnInit() {
    this.loadTotalScan();
    this.checkQRCode();
  }
  // sau khi scan input thay doi
  async onNgModelChangeScanQRCode(args) {
    this.success = 0;
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
  loadTotalScan() {
    this.service.countWorkerScanQRCodeByToday().subscribe(
      (res) => {
        this.total = res;
      },
      (error) => {
        this.total = 0;
      }
    );
  }
  scanQRCode() {
    this.success = 0;
    this.service.accessControl(this.QRCode).subscribe(
      (res) => {
        this.loadTotalScan();
        this.employeeData = res.data;
        this.switchColor = !this.switchColor;
        this.success = res.statusCode;
        this.message = res.message;
        if (res.success && res.statusCode == 200) {
          this.fullName = res.data.fullName;
          this.message = res.message;
          this.successBeep();
        } else {
          this.errorBeep();
        }
      },
      (error) => {
        this.success = 500;
        this.errorBeep();
      }
    );
  }
  successBeep() {
    var snd = new Audio(this.successBeepUrl);
    snd.play();
}
errorBeep() {
  var snd = new Audio(this.errorBeepUrl);
  snd.play();
}
}
