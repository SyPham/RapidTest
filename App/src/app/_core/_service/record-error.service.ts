import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { UtilitiesService } from './utilities.service';
import { RecordError } from '../_model/record-error';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RecordErrorService extends CURDService<RecordError> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"RecordError", utilitiesService);
  }
  getRecordError(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}RecordError/GetRecordError`);
  }
  getAccessFailed(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}RecordError/GetAccessFailed`);
  }
}
