import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

import { environment } from '../../../environments/environment'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  })
};
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = environment.apiUrl;
  messageSource = new BehaviorSubject<number>(0);
  currentMessage = this.messageSource.asObservable();
  // method này để change source message
  changeMessage(message) {
    this.messageSource.next(message);
  }
  constructor(private http: HttpClient) { }
  getQ1Q3Data(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Report/GetQ1Q3Data`, {});
  }

  getGHRData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Report/GetGHRData`, {});
  }

  getQ1Q3DataByLeo(currentTime): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Report/getQ1Q3DataByLeo?currentTime=${currentTime}`, {});
  }
  getQ1Q3ReportInfo(accountId): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Report/getQ1Q3ReportInfo?accountId=${accountId}`, {});
  }
  q1q3ExportExcel(accountId: number) {
    return this.http.get(`${this.baseUrl}Report/ExportExcel/${accountId}`, { responseType: 'blob' });
  }
  q1q3ExportExcelByLeo(currentTime) {
    return this.http.get(`${this.baseUrl}Report/ExportExcelByLeo?currentTime=${currentTime}`, { responseType: 'blob' });
  }
  geH1H2Data(): Observable<any>  {
    return this.http.get<any>(`${this.baseUrl}Report/GetH1H2Data`, {});
  }
  H1H2ExportExcel(accountId: number) {
    return this.http.get(`${this.baseUrl}Report/ExportH1H2Excel/${accountId}`, { responseType: 'blob' });
  }
  getH1H2ReportInfo(accountId): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Report/getH1H2ReportInfo?accountId=${accountId}`, {});
  }
  getGHRReportH1Info(accountId): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Report/GetGHRReportH1Info?accountId=${accountId}`, {});
  }

  getGHRReportH2Info(accountId): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Report/GetGHRReportH2Info?accountId=${accountId}`, {});
  }

  ReportUpdateComment(model) {
    return this.http.put(`${this.baseUrl}Report/ReportUpdateComment`, model);
  }
  ReportUpdateAtScore(model) {
    return this.http.put(`${this.baseUrl}Report/ReportUpdateAtScore`, model);
  }
  ReportUpdateSpe(model) {
    return this.http.put(`${this.baseUrl}Report/ReportUpdateSpeComment`, model);
  }

  geHQHRData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Report/GetHQHRData`, {});
  }
}
