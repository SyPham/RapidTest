import { Setting } from './../_model/setting';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CURDService } from './CURD.service';
import { UtilitiesService } from './utilities.service';
@Injectable({
  providedIn: 'root'
})
export class SettingService extends CURDService<Setting> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"Setting", utilitiesService);
  }

}
