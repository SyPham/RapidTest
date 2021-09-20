import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Period } from '../_model/period';
import { UtilitiesService } from './utilities.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PeriodService extends CURDService<Period> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"Period", utilitiesService);
  }
  getAllByPeriodTypeId(periodTypeId): Observable<Period[]> {
    return this.http
      .get<Period[]>(`${this.base}${this.entity}/GetAllByPeriodTypeId?periodTypeId=${periodTypeId}`, {})
      .pipe(catchError(this.handleError));
  }
}
