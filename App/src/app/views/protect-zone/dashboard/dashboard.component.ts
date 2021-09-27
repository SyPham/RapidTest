import { Component, OnInit } from '@angular/core';
import { RapidTestReportService } from 'src/app/_core/_service/rapid.test.report.service';
import { Browser } from '@syncfusion/ej2-base';
import { ChartTheme, ILoadedEventArgs } from '@syncfusion/ej2-angular-charts';
import { interval, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  subject = new Subject<boolean>();
  subscription: Subscription[] = [];
  dataSource = [];
  public data: Object[] = [
    { x: 'USA', y: 46 }
];
public data1: Object[] = [
    { x: 'USA', y: 37 }
];
public data2: Object[] = [
    { x: 'USA', y: 38 }
];
public data3: Object[] = [
  { x: 'USA', y: 38 }
];
auto: any = false;
//Initializing Primary X Axis
public primaryXAxis: Object = {
    valueType: 'Category', interval: 1,
    majorGridLines: { width: 0 },
    minorGridLines: { width: 0 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 }
};
//Initializing Primary Y Axis
public primaryYAxis: Object = {
  majorGridLines: { width: 0 },
  minorGridLines: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 }
};
public marker: Object = { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }
public title: string = 'Rapid Test';
intervalGlobal: any;
public tooltip: Object = {
    enable: true
};
  // custom code start
public load(args: ILoadedEventArgs): void {
    // let selectedTheme: string = location.hash.split('/')[1];
    // selectedTheme = selectedTheme ? selectedTheme : 'Bootstrap4';
    // args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
    args.chart.series[0].marker.dataLabel.font.color= '#008000';
    args.chart.series[1].marker.dataLabel.font.color= '#008000';
    args.chart.series[2].marker.dataLabel.font.color= '#FF0000';
    args.chart.series[3].marker.dataLabel.font.color= '#008000';
};
  // custom code end
public chartArea: Object = {
    border: {
        width: 0
    }
};
public width: string = Browser.isDevice ? '100%' : '60%';


  constructor(
    private service: RapidTestReportService
  ) { }
  ngOnInit() {
    this.auto = JSON.parse(localStorage.getItem('auto')) || false;
    if (this.auto) {
      this.intervalGlobal =  setInterval(() => {this.loadData()}, 3000);
    } else {
      this.loadData();
    }
    this.checkAuto();

  }
  private checkAuto() {
    this.subscription.push(this.subject
      .pipe()
      .subscribe(async (res) => {
        this.auto = res;
        if(this.auto == true) {
          this.intervalGlobal =  setInterval(() => {this.loadData()}, 3000);
         } else {
           if (this.intervalGlobal) {
             clearInterval(this.intervalGlobal);
           }
         }
      }));
  }
  async onNgModelChangeScanQRCode(args) {
    this.auto = args;
    localStorage.setItem('auto', args + '');
    this.subject.next(args);
  }
  loadData() {
    this.service.dashboard().subscribe(data => {
      this.dataSource = data.data;
      this.data= this.dataSource[0];
      this.data1= this.dataSource[1];
      this.data2= this.dataSource[2];
      this.data3= this.dataSource[3];
      console.log(this.dataSource)
    }, () => this.dataSource = []);
  }
}
