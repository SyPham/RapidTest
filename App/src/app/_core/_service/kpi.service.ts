import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { KPI } from '../_model/kpi';
import { UtilitiesService } from './utilities.service';
@Injectable({
  providedIn: 'root'
})
export class KPIService extends CURDService<KPI> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"KPI", utilitiesService);
  }

}
