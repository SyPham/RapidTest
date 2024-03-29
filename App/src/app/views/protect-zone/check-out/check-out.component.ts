import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Employee } from 'src/app/_core/_model/employee';
import { ErrorCode } from 'src/app/_core/_model/error-code';
import { TestKind } from 'src/app/_core/_model/test-kind';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { RapidTestReportService } from 'src/app/_core/_service/rapid.test.report.service';
import { TestKindService } from 'src/app/_core/_service/test.kind.service';
import { environment } from 'src/environments/environment';

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
  result = 2;
  testKindData: TestKind[];
  QRCode: string;
  success = 0;
  fullName: any;
  message: any;
  switchColor = false;
  total = 0;
  employeeData :Employee;
  successBeepUrl = environment.apiUrl.replace('api/', '') + 'audio/successBeep.mp3';
  errorBeepUrl= environment.apiUrl.replace('api/', '') + 'audio/errorBeep.mp3';

  xinMoiQuaUrl= environment.apiUrl.replace('api/', '') + 'audio/xin-moi-qua.mp3';
  chuaDuThoiGianUrl= environment.apiUrl.replace('api/', '') + 'audio/chua-du-thoi-gian.mp3';
  chuaCheckInUrl= environment.apiUrl.replace('api/', '') + 'audio/chua-check-in.mp3';
  danhSachDenUrl= environment.apiUrl.replace('api/', '') + 'audio/danh-sach-den.mp3';
  saiSoTheUrl= environment.apiUrl.replace('api/', '') + 'audio/sai-so-the.mp3';
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
    this.loadTotalScan();
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
    const model = {
      kindId: this.kindId,
      result: this.result,
      qrCode: this.QRCode
    };
    this.service.scanQRCode(model).subscribe(
      (res) => {
        this.loadTotalScan();

        this.employeeData = res.data;
        this.switchColor = !this.switchColor;
        this.success = res.statusCode;
        this.message = res.message;

        if (res.success === true && res.statusCode == 200) {
          this.fullName = res.data.fullName;
          this.successBeep();
        } else {
          this.errorBeep();
        }
        // if (res.errorCode == ErrorCode.XIN_MOI_QUA) {
        //   this.xinMoiQua();
        // } else if (res.errorCode == ErrorCode.CHUA_CHECK_IN) {
        //   this.chuaCheckIn();
        // } else if (res.errorCode == ErrorCode.CHUA_DU_THOI_GIAN) {
        //   this.chuaDuThoiGian();
        // } else if (res.errorCode == ErrorCode.DANH_SACH_DEN) {
        //   this.danhSachDen();
        // } else if (res.errorCode == ErrorCode.SAI_SO_THE) {
        //   this.saiSoThe();
        // } else {
        //   this.errorBeep();
        // }
      },
      (error) => {
          this.errorBeep();
          this.success = 500;
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
chuaCheckIn() {
  var snd = new Audio(this.chuaCheckInUrl);
  snd.play();
}
chuaDuThoiGian() {
  var snd = new Audio(this.chuaDuThoiGianUrl);
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
