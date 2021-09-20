import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.scss']
})
export class AccessControlComponent implements OnInit {
  test: any = 'form-control w3-light-grey';
  qrcodeChange: any;
  checkout = false;
  checkin = true;

  constructor() { }

  ngOnInit() {
  }
  // sau khi scan input thay doi
  async onNgModelChangeScanQRCode(args) {

  }

}
