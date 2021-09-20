import { AccountGroup } from './../_model/account.group';
import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { UtilitiesService } from './utilities.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AccountGroupService extends CURDService<AccountGroup> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"AccountGroup", utilitiesService);
  }
  getAccountGroupForTodolistByAccountId(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}${this.entity}/GetAccountGroupForTodolistByAccountId`);
  }
}
