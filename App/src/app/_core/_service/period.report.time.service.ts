import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { UtilitiesService } from './utilities.service';
import { PeriodReportTime } from '../_model/period.report.time';
@Injectable({
  providedIn: 'root'
})
export class PeriodReportTimeService extends CURDService<PeriodReportTime> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"PeriodReportTime", utilitiesService);
  }

}
