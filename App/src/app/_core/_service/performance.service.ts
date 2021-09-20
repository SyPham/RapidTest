import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';
import { Performance } from 'src/app/_core/_model/performance';
import { HttpClient } from '@angular/common/http';
import { UtilitiesService } from './utilities.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OperationResult } from '../_model/operation.result';
@Injectable({
  providedIn: 'root'
})
export class PerformanceService extends CURDService<Performance> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"Performance", utilitiesService);
  }

  getKPIObjectivesByUpdater(): Observable<any> {
    return this.http
      .get<any>(`${this.base}${this.entity}/GetKPIObjectivesByUpdater`, {})
      .pipe(catchError(this.handleError));
  }

  submit(model): Observable<OperationResult> {
    return this.http.put<OperationResult>(`${this.base}${this.entity}/Submit`, model).pipe(
      catchError(this.handleError)
    );
  }
}
