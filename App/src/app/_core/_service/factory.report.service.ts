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
export class FactoryReportService  {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient,utilitiesService: UtilitiesService)
  {
  }
  accessControl(code): Observable<OperationResult> {
    return this.http.get<OperationResult>(this.baseUrl + 'FactoryReport/AccessControl?code=' + code);
  }
  filter(startDate, endDate, code): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}FactoryReport/filter?startDate=${startDate}&endDate=${endDate}&code=${code}`);
  }
}
