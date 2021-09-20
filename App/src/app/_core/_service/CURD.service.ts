import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MessageConstants } from '../_constants/system';
import { OperationResult } from '../_model/operation.result';

import { BaseService } from './base.service';
import { UtilitiesService } from './utilities.service';
//#region
// Copyright Phạm Tiến Sỹ
//#endregion
export interface ICURDService<T> {
  getAll(): Observable<T[]>;
  getById(id): Observable<T>;
  //#endregion

  //#region Action
  insertWithFormData(model: T): Observable<OperationResult>;
  updateWithFormData(model: T): Observable<OperationResult>;

  add(model: T): Observable<OperationResult>;
  update(model: T): Observable<OperationResult>;
  delete(id: any): Observable<OperationResult>;
  deleterange(ids: object[]): Observable<OperationResult>;
  changeValue(message: MessageConstants);
}
@Injectable()
export class CURDService<T> extends BaseService implements ICURDService<T> {
  protected base = environment.apiUrl;

  //#region Field
  protected _sharedHeaders = new HttpHeaders();
  //#endregion

  //#region Ctor
  constructor(
    protected http: HttpClient,
    @Inject(String) protected entity: string,
    protected utilitiesService: UtilitiesService
  ) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }
  //#endregion

  //#region LoadData
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.base}${this.entity}/getall`, {}).pipe(
      map((data) => {
        let idSequence = 1;
        data.forEach((item) => {
          const sequence = 'sequence';
          item[sequence] = idSequence++;
        });
        return data;
      }),
      catchError(this.handleError)
    );
  }
  getById(id): Observable<T> {
    return this.http
      .get<T>(`${this.base}${this.entity}/getById?id=${id}`, {})
      .pipe(catchError(this.handleError));
  }
  //#endregion

  //#region Action
  insertWithFormData(model: T): Observable<OperationResult> {
    const params = this.utilitiesService.ToFormData(model);
    return this.http
      .post<OperationResult>(`${this.base}${this.entity}/insert`, params)
      .pipe(catchError(this.handleError));
  }
  updateWithFormData(model: T): Observable<OperationResult> {
    const params = this.utilitiesService.ToFormData(model);
    return this.http
      .put<OperationResult>(`${this.base}${this.entity}/update`, params)
      .pipe(catchError(this.handleError));
  }

  add(model: T): Observable<OperationResult> {
    return this.http
      .post<OperationResult>(`${this.base}${this.entity}/add`, model)
      .pipe(catchError(this.handleError));
  }
  addRange(model: T[]): Observable<OperationResult> {
    return this.http
      .post<OperationResult>(`${this.base}${this.entity}/addRange`, model)
      .pipe(catchError(this.handleError));
  }
  updateRange(model: T[]): Observable<OperationResult> {
    return this.http
      .put<OperationResult>(`${this.base}${this.entity}/updateRange`, model)
      .pipe(catchError(this.handleError));
  }
  update(model: T): Observable<OperationResult> {
    return this.http
      .put<OperationResult>(`${this.base}${this.entity}/update`, model)
      .pipe(catchError(this.handleError));
  }
  updatestatus(id: T): Observable<OperationResult> {
    return this.http
      .put<OperationResult>(`${this.base}${this.entity}/updatestatus?id=${id}`, {})
      .pipe(catchError(this.handleError));
  }
  delete(id: any): Observable<OperationResult> {
    return this.http
      .delete<OperationResult>(`${this.base}${this.entity}/delete?id=${id}`)
      .pipe(catchError(this.handleError));
  }
  deleterange(ids: object[]): Observable<OperationResult> {
    let query = '';
    for (const id of ids) {
      query += `id=${id}&`;
    }
    return this.http
      .delete<OperationResult>(`${this.base}${this.entity}/deleterange?${query}`)
      .pipe(catchError(this.handleError));
  }

  //#endregion
}
