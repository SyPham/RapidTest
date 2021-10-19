import { Employee } from './../../../_core/_model/employee';
import { TestKindService } from 'src/app/_core/_service/test.kind.service';
import { EmployeeService } from './../../../_core/_service/employee.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TestKind } from 'src/app/_core/_model/test-kind';
import { environment } from 'src/environments/environment';

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
          this.successBeep();
          this.fullName = res.data.fullName;
        } else {
          this.errorBeep();
        }
      },
      (error) => {
        this.success = 0;
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
