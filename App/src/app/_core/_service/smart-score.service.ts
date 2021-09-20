import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { SmartScore } from '../_model/smart-score';
import { UtilitiesService } from './utilities.service';
@Injectable({
  providedIn: 'root'
})
export class SmartScoreService extends CURDService<SmartScore> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"SmartScore", utilitiesService);
  }

}
