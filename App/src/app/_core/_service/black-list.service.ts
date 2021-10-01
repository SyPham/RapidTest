import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { UtilitiesService } from './utilities.service';
import { BlackList } from '../_model/black-list';
@Injectable({
  providedIn: 'root'
})
export class BlackListService extends CURDService<BlackList> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"BlackList", utilitiesService);
  }

}
