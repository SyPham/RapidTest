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
export class OcService {
  baseUrl = environment.apiUrl;
  messageSource = new BehaviorSubject<number>(0);
  currentMessage = this.messageSource.asObservable();
  // method này để change source message
  changeMessage(message) {
    this.messageSource.next(message);
  }
  constructor(private http: HttpClient) { }
  delete(id) { return this.http.delete(`${this.baseUrl}Oc/Delete/${id}`); }
  rename(edit) { return this.http.put(`${this.baseUrl}Oc/Update`, edit); }
  getOCs() {
    return this.http.get(`${this.baseUrl}Oc/GetAllAsTreeView`);
  }
  GetUserByOCname(ocName) {
    return this.http.get(`${this.baseUrl}Oc/GetUserByOCname/${ocName}`, {});
  }
  GetUserByOcID(ocID) {
    return this.http.get(`${this.baseUrl}Oc/GetUserByOcID/${ocID}`, {});
  }
  getAllLv3() {
    return this.http.get(`${this.baseUrl}Oc/GetAllLevel3`, {});
  }
  addOC(oc) {
    return this.http.post(`${this.baseUrl}Oc/Add`, oc);
  }
  updateOC(oc) {
    return this.http.put(`${this.baseUrl}Oc/Update`, oc);
  }
  mapUserOC(model) {
    return this.http.post(`${this.baseUrl}Oc/MappingUserOC`, model);
  }
  mapRangeUserOC(model) {
    return this.http.post(`${this.baseUrl}Oc/MappingRangeUserOC`, model);
  }
  removeUserOC(model) {
    return this.http.post(`${this.baseUrl}Oc/RemoveUserOC`, model);
  }
  createMainOC(oc) { return this.http.post(`${this.baseUrl}Ocs/CreateOc`, oc); }
  createSubOC(oc) { return this.http.post(`${this.baseUrl}Ocs/CreateSubOC`, oc); }
}
