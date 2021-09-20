import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { catchError } from 'rxjs/operators'

import { CURDService } from './CURD.service'
import { Account } from '../_model/account'
import { UtilitiesService } from './utilities.service'
import { OperationResult } from '../_model/operation.result'

@Injectable({
  providedIn: 'root'
})
export class Account2Service extends CURDService<Account> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"Account", utilitiesService);
  }
  lock(id): Observable<OperationResult> {
    return this.http.put<OperationResult>(`${this.base}Account/lock?id=${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }
  getAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}Account/GetAccounts`);
  }

}
