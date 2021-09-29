import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { KPI } from '../_model/kpi';
import { UtilitiesService } from './utilities.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { OperationResult } from '../_model/operation.result';
@Injectable({
  providedIn: 'root'
})
export class RapidTestReportService  {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient,utilitiesService: UtilitiesService)
  {
  }
  scanQRCode(model): Observable<OperationResult> {
    return this.http.post<OperationResult>(this.baseUrl + 'Report/ScanQRCode', model);
  }
  filter(startDate, endDate, code): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Report/filter?startDate=${startDate}&endDate=${endDate}&code=${code}`);
  }
  dashboard(startDate, endDate): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Report/Dashboard?startDate=${startDate}&endDate=${endDate}`);
  }
  checkInFilter(date, code): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Report/checkInFilter?date=${date}&code=${code}`);
  }
}
