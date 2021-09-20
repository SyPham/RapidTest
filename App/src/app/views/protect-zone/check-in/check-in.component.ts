import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {

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
