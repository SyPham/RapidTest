import { Employee } from './../../../_core/_model/employee';
import { TestKindService } from 'src/app/_core/_service/test.kind.service';
import { EmployeeService } from './../../../_core/_service/employee.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TestKind } from 'src/app/_core/_model/test-kind';
import { environment } from 'src/environments/environment';
import { PingService } from 'src/app/_core/_service/ping.service';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit,OnDestroy  {
  test: any = 'form-control w3-light-grey';
  subject = new Subject<string>();
  subscription: Subscription[] = [];
  QRCode: string;
  success = 0;
  fullName: any;
  kindId: any;
  testKindData: TestKind[];
  switchColor = false;
  total = 0;
  message = '';
  employeeData :Employee;
  successBeepUrl = environment.apiUrl.replace('api/', '') + 'audio/successBeep.mp3';
  errorBeepUrl= environment.apiUrl.replace('api/', '') + 'audio/errorBeep.mp3';


  xinMoiQuaUrl= environment.apiUrl.replace('api/', '') + 'audio/xin-moi-qua.mp3';
  hetHanUrl= environment.apiUrl.replace('api/', '') + 'audio/het-han.mp3';
  danhSachDenUrl= environment.apiUrl.replace('api/', '') + 'audio/danh-sach-den.mp3';
  saiSoTheUrl= environment.apiUrl.replace('api/', '') + 'audio/sai-so-the.mp3';
  ping: number;
  constructor(
    private service: EmployeeService,
    private serviceTestKind: TestKindService
  ) { }
  ngOnDestroy(): void {
    this.subscription.forEach(item => item.unsubscribe());

  }
  ngOnInit() {

    this.loadData();
    this.checkQRCode();
    this.loadTotalScan();

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
          this.checkin();
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
  checkin() {
    this.success = 0;
    this.service.checkin2(this.QRCode, this.kindId).subscribe(
      (res) => {
        this.employeeData = res.data;
        this.loadTotalScan();
        this.message = res.message;
        this.switchColor = !this.switchColor;
        this.success = res.statusCode;
        if (res.success && res.statusCode == 200) {
          this.fullName = res.data.fullName;
        }
        if (res.errorCode == 'Xin moi qua') {
          this.xinMoiQua();
        } else if (res.errorCode == 'Danh sach den') {
          this.danhSachDen();
        } else if (res.errorCode == 'Sai so the') {
          this.saiSoThe();
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

danhSachDen() {
  var snd = new Audio(this.danhSachDenUrl);
  snd.play();
}
saiSoThe() {
  var snd = new Audio(this.saiSoTheUrl);
  snd.play();
}

}
