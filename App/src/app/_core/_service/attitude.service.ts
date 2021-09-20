import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Attitude } from '../_model/attitude';
import { UtilitiesService } from './utilities.service';
@Injectable({
  providedIn: 'root'
})
export class AttitudeService extends CURDService<Attitude> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"Attitude", utilitiesService);
  }

}
