import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { KPI } from '../_model/kpi';
import { UtilitiesService } from './utilities.service';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { OperationResult } from '../_model/operation.result';
import { catchError } from 'rxjs/operators';
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
  countWorkerScanQRCodeByToday(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}FactoryReport/CountWorkerScanQRCodeByToday`);
  }
  delete(id: any): Observable<OperationResult> {
    return this.http
      .delete<OperationResult>(`${this.baseUrl}FactoryReport/delete?id=${id}`)
      .pipe(catchError(this.handleError));
  }
  protected handleError(errorResponse: any) {
    if (errorResponse?.error?.message) {
        return throwError(errorResponse?.error?.message || 'Server error');
    }

    if (errorResponse?.error?.errors) {
        let modelStateErrors = '';

        // for now just concatenate the error descriptions, alternative we could simply pass the entire error response upstream
        for (const errorMsg of errorResponse?.error?.errors) {
            modelStateErrors += errorMsg + '<br/>';
        }
        return throwError(modelStateErrors || 'Server error');
    }
    return throwError('Server error');
}
}
