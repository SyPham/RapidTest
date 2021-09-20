import { environment } from 'src/environments/environment';
import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { UtilitiesService } from './utilities.service';
import { SelfScore, ToDoList, ToDoListByLevelL1L2Dto, ToDoListL1L2, ToDoListOfQuarter } from '../_model/todolistv2';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Objective } from '../_model/objective';
import { OperationResult } from '../_model/operation.result';
@Injectable({
  providedIn: 'root'
})
export class Todolist2Service  {
  messageSource = new BehaviorSubject<boolean>(null);
  currentMessage = this.messageSource.asObservable();
  entity = 'Todolist2';
  base = environment.apiUrl;
  // có thể subcribe theo dõi thay đổi value của biến này thay cho messageSource
  constructor(private http: HttpClient, utilitiesService: UtilitiesService) {
  }
  // method này để change source message
  changeMessage(message) {
    this.messageSource.next(message);
  }

  l0(currentTime): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/L0?currentTime=${currentTime}`, {})
      .pipe(catchError(this.handleError));
  }
  submitUpdatePDCA(model): Observable<OperationResult> {
    return this.http.post<OperationResult>(`${this.base}${this.entity}/SubmitUpdatePDCA`, model);
  }
  submitAction(model): Observable<OperationResult> {
    return this.http.post<OperationResult>(`${this.base}${this.entity}/submitAction`, model);
  }
  submitKPINew(kpiId): Observable<OperationResult> {
    return this.http.post<OperationResult>(`${this.base}${this.entity}/SubmitKPINew?kpiId=${kpiId}`, {});
  }
  getStatus(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/getStatus`, {})
      .pipe(catchError(this.handleError));
  }
  getActionsForL0(kpiNewId): Observable<any> {
    return this.http
      .get<any>(`${this.base}${this.entity}/GetActionsForL0?kpiNewId=${kpiNewId}`, {})
      .pipe(catchError(this.handleError));
  }
  getPDCAForL0(kpiNewId,currentTime ): Observable<any> {
    return this.http
      .get<any>(`${this.base}${this.entity}/GetPDCAForL0?kpiNewId=${kpiNewId}&currentTime=${currentTime}`, {})
      .pipe(catchError(this.handleError));
  }

  getKPIForUpdatePDC(kpiNewId,currentTime ): Observable<any> {
    return this.http
      .get<any>(`${this.base}${this.entity}/GetKPIForUpdatePDC?kpiNewId=${kpiNewId}&currentTime=${currentTime}`, {})
      .pipe(catchError(this.handleError));
  }

  getTargetForUpdatePDCA(kpiNewId,currentTime ): Observable<any> {
    return this.http
      .get<any>(`${this.base}${this.entity}/GetTargetForUpdatePDCA?kpiNewId=${kpiNewId}&currentTime=${currentTime}`, {})
      .pipe(catchError(this.handleError));
  }

  getActionsForUpdatePDCA(kpiNewId,currentTime ): Observable<any> {
    return this.http
      .get<any>(`${this.base}${this.entity}/GetActionsForUpdatePDCA?kpiNewId=${kpiNewId}&currentTime=${currentTime}`, {})
      .pipe(catchError(this.handleError));
  }
  download(kpiId,uploadTime ) {
    return this.http
      .get(`${this.base}UploadFile/download?kpiId=${kpiId}&uploadTime=${uploadTime}`, { responseType: 'blob' })
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
