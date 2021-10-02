import { Setting, UpdateDescriptionRequest } from './../_model/setting';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CURDService } from './CURD.service';
import { UtilitiesService } from './utilities.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OperationResult } from '../_model/operation.result';
@Injectable({
  providedIn: 'root'
})
export class SettingService extends CURDService<Setting> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"Setting", utilitiesService);
  }
  updateDescription(model: UpdateDescriptionRequest): Observable<OperationResult> {
    return this.http
      .put<OperationResult>(`${this.base}${this.entity}/updateDescription`, model)
      .pipe(catchError(this.handleError));
  }

}
