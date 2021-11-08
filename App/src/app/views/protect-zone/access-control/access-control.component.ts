import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Employee } from 'src/app/_core/_model/employee';
import { ErrorCode } from 'src/app/_core/_model/error-code';
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

  xinMoiQuaUrl= environment.apiUrl.replace('api/', '') + 'audio/xin-moi-qua.mp3';
  chuaCheckOutUrl= environment.apiUrl.replace('api/', '') + 'audio/chua-check-out.mp3';
  hetHanUrl= environment.apiUrl.replace('api/', '') + 'audio/het-han.mp3';
  danhSachDenUrl= environment.apiUrl.replace('api/', '') + 'audio/danh-sach-den.mp3';
  saiSoTheUrl= environment.apiUrl.replace('api/', '') + 'audio/sai-so-the.mp3';
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
        }
        if (res.errorCode == ErrorCode.XIN_MOI_QUA) {
          this.xinMoiQua();
        } else if (res.errorCode == ErrorCode.CHUA_CHECK_OUT) {
          this.chuaCheckOut();
        } else if (res.errorCode == ErrorCode.HET_HAN) {
          this.hetHan();
        } else if (res.errorCode == ErrorCode.DANH_SACH_DEN) {
          this.danhSachDen();
        } else if (res.errorCode == ErrorCode.SAI_SO_THE) {
          this.saiSoThe();
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
xinMoiQua() {
  var snd = new Audio(this.xinMoiQuaUrl);
  snd.play();
}
chuaCheckOut() {
  var snd = new Audio(this.chuaCheckOutUrl);
  snd.play();
}
hetHan() {
  var snd = new Audio(this.hetHanUrl);
  snd.play();
}
danhSachDen() {
  var snd = new Audio(this.danhSachDenUrl);
  snd.play();
}
saiSoThe() {
  var snd = new Audio(this.saiSoTheUrl);
  snd.play();
}
}
