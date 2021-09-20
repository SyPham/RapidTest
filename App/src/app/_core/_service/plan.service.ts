import { Plan } from './../_model/plan';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CURDService } from './CURD.service';
import { UtilitiesService } from './utilities.service';
@Injectable({
  providedIn: 'root'
})
export class PlanService extends CURDService<Plan> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"Plan", utilitiesService);
  }

}
