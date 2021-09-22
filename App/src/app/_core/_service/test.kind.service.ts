import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { TestKind } from '../_model/test-kind';
import { UtilitiesService } from './utilities.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OperationResult } from '../_model/operation.result';
@Injectable({
  providedIn: 'root'
})
export class TestKindService extends CURDService<TestKind> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"TestKind", utilitiesService);
  }
  toggleIsDefault(id): Observable<OperationResult> {
    return this.http.put<OperationResult>(`${this.base}TestKind/ToggleIsDefault?id=${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }
}
