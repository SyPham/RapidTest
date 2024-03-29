import { Injectable } from '@angular/core';
import { PaginatedResult } from '../_model/pagination';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OcPolicyService {

  baseUrl = environment.apiUrl;
  messageSource = new BehaviorSubject<number>(0);
  currentMessage = this.messageSource.asObservable();
  // method này để change source message
  changeMessage(message) {
    this.messageSource.next(message);
  }
  constructor(private http: HttpClient) { }
  getOCs() {
    return this.http.get(`${this.baseUrl}Ocs/GetListTree`);
  }
  addPolicy(model) {
    return this.http.post(`${this.baseUrl}Ocpolicy/MappingPolicyOc`, model);
  }
  updatePolicy(model) {
    return this.http.post(`${this.baseUrl}Ocpolicy/RemovePolicyOC`, model);
  }
  deletePolicy(id) {
    return this.http.delete(`${this.baseUrl}Ocpolicy/DeletePolicy/${id}`);
  }
  getAllPolicy(){
    return this.http.get(`${this.baseUrl}Ocpolicy/GetAllPolicy`);
  }
  getListUser(page = 1, pageSize = 10, ocid = 0): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<any[]>();
    return this.http.get(`${this.baseUrl}OcUsers/GetUsers/${page}/${pageSize}/${ocid}`, {
      observe: 'response'
    }).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get('Pagination')
            );
          }
        return paginatedResult;
      })
    );
  }
  search(page = 1, pageSize = 10, ocid = 0, text = '%20'): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<any[]>();
    return this.http.get(`${this.baseUrl}OcUsers/GetUsers/${page}/${pageSize}/${ocid}/${text}`, {
      observe: 'response'
    }).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get('Pagination')
            );
          }
        return paginatedResult;
      })
    );
  }
  addOrUpdate(userid, ocid, status) {
    return this.http.get(`${this.baseUrl}OCUsers/AddOrUpdate/${userid}/${ocid}/${status}`)
  }

}
