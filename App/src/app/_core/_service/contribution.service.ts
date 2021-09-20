import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';
import { Contribution } from 'src/app/_core/_model/contribution';
import { HttpClient } from '@angular/common/http';
import { UtilitiesService } from './utilities.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ContributionService extends CURDService<Contribution> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"Contribution", utilitiesService);
  }

  getFisrtByAccountId(accountId, periodTypeId,period, scoreType): Observable<Contribution> {
    return this.http
      .get<Contribution>(`${this.base}${this.entity}/GetFisrtByAccountId?accountId=${accountId}&periodTypeId=${periodTypeId}&period=${period}&scoreType=${scoreType}`, {})
      .pipe(catchError(this.handleError));
  }

  getL1CommentByAccountId(accountId, periodTypeId, period): Observable<Contribution> {
    return this.http
      .get<Contribution>(`${this.base}${this.entity}/GetL1CommentByAccountId?accountId=${accountId}&periodTypeId=${periodTypeId}&period=${period}`, {})
      .pipe(catchError(this.handleError));
  }
}
