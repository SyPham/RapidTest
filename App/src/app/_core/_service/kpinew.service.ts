import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

import { environment } from '../../../environments/environment'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class KpinewService {

  baseUrl = environment.apiUrl;
  messageSource = new BehaviorSubject<number>(0);
  currentMessage = this.messageSource.asObservable();
  // method này để change source message
  changeMessage(message) {
    this.messageSource.next(message);
  }
  constructor(private http: HttpClient) { }

  getKPIByOcID(ocID) {
    return this.http.get(`${this.baseUrl}KPINew/GetKPIByOcID/${ocID}`, {});
  }

  getPolicyByOcID(ocID) {
    return this.http.get(`${this.baseUrl}KPINew/GetPolicyByOcID/${ocID}`, {});
  }

  getAllType() {
    return this.http.get(`${this.baseUrl}KPINew/getAllType`, {});
  }
  add(model) {
    return this.http.post(`${this.baseUrl}KPINew/Add`, model);
  }
  update(model) {
    return this.http.put(`${this.baseUrl}KPINew/update`, model);
  }
  delete(id) {
    return this.http.delete(`${this.baseUrl}KPINew/delete/${id}`);
  }
}
