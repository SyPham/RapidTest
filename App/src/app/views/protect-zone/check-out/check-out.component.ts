import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {
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
