import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilitiesService } from './utilities.service';
import { RecordError } from '../_model/record-error';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RecordErrorService  {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,utilitiesService: UtilitiesService)
  {
  }
  getRecordError(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}RecordError/GetRecordError`);
  }
  getAccessFailed(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}RecordError/GetAccessFailed`);
  }
  filterRecordError(date): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}RecordError/filterRecordError?date=${date}`);
  }
  filterAccessFailed(date): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}RecordError/filterAccessFailed?date=${date}`);
  }
}
