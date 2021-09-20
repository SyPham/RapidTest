import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { SpecialContributionScore } from '../_model/special-contribution-score';
import { UtilitiesService } from './utilities.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SpecialContributionScoreService extends CURDService<SpecialContributionScore> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"SpecialContributionScore", utilitiesService);
  }
  getFisrtByObjectiveIdAndScoreBy(objectiveId, scoreBy): Observable<SpecialContributionScore> {
    return this.http
      .get<SpecialContributionScore>(`${this.base}${this.entity}/GetFisrtByObjectiveIdAndScoreBy?objectiveId=${objectiveId}&scoreby=${scoreBy}`, {})
      .pipe(catchError(this.handleError));
  }
  getFisrtByAccountId(accountId, periodTypeId, period, scoreType): Observable<SpecialContributionScore> {
    const apiUrl =`${this.base}${this.entity}/GetFisrtByAccountId?accountId=${accountId}&periodTypeId=${periodTypeId}&period=${period}&scoreType=${scoreType}`;
    return this.http
      .get<SpecialContributionScore>(apiUrl, {})
      .pipe(catchError(this.handleError));
  }
  getSpecialScoreByAccountId(accountId, periodTypeId, period, scoreType): Observable<SpecialContributionScore> {
    const apiUrl =`${this.base}${this.entity}/GetSpecialScoreByAccountId?accountId=${accountId}&periodTypeId=${periodTypeId}&period=${period}&scoreType=${scoreType}`;
    return this.http
      .get<SpecialContributionScore>(apiUrl, {})
      .pipe(catchError(this.handleError));
  }
}
