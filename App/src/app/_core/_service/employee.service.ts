import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Employee } from '../_model/employee';
import { UtilitiesService } from './utilities.service';
import { OperationResult } from '../_model/operation.result';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends CURDService<Employee> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"Employee", utilitiesService);
  }
  importExcel(file) {
    const formData = new FormData();
    formData.append('UploadedFile', file);
    formData.append('CreatedBy', JSON.parse(localStorage.getItem('user')).id);
    return this.http.post(this.base + 'Employee/ImportExcel', formData);
  }
  toggleSEAInform(id): Observable<OperationResult> {
    return this.http.put<OperationResult>(`${this.base}Employee/ToggleSEAInform?id=${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }
  checkin(code): Observable<OperationResult> {
    return this.http.get<OperationResult>(this.base + 'Employee/Checkin?code=' + code);
  }
  checkin2(code, testKindId): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}Employee/Checkin2?code=${code}&testKindId=${testKindId}`);
  }
}
