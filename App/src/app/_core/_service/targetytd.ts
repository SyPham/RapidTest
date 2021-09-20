import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { TargetYTD } from '../_model/targetytd';
import { UtilitiesService } from './utilities.service';
@Injectable({
  providedIn: 'root'
})
export class TargetYTDervice extends CURDService<TargetYTD> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"TargetYTD", utilitiesService);
  }

}
