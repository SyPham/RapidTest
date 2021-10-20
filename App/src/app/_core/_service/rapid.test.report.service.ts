import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { KPI } from '../_model/kpi';
import { UtilitiesService } from './utilities.service';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { OperationResult } from '../_model/operation.result';
import { catchError } from 'rxjs/operators';
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
  countWorkerScanQRCodeByToday(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Report/CountWorkerScanQRCodeByToday`);
  }
  deleteCheckIn(id: any): Observable<OperationResult> {
    return this.http
      .delete<OperationResult>(`${this.baseUrl}Report/deleteCheckIn?id=${id}`)
      .pipe(catchError(this.handleError));
  }
  delete(id: any): Observable<OperationResult> {
    return this.http
      .delete<OperationResult>(`${this.baseUrl}Report/delete?id=${id}`)
      .pipe(catchError(this.handleError));
  }
  importExcel3(file) {
    const formData = new FormData();
    formData.append('UploadedFile', file);
    formData.append('CreatedBy', JSON.parse(localStorage.getItem('user')).id);
    return this.http.post(this.baseUrl + 'Report/ImportExcel', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
  }
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
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
