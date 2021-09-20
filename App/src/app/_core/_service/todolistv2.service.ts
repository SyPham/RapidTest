import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { UtilitiesService } from './utilities.service';
import { SelfScore, ToDoList, ToDoListByLevelL1L2Dto, ToDoListL1L2, ToDoListOfQuarter } from '../_model/todolistv2';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Objective } from '../_model/objective';
import { OperationResult } from '../_model/operation.result';
@Injectable({
  providedIn: 'root'
})
export class Todolistv2Service extends CURDService<ToDoList> {
  messageSource = new BehaviorSubject<boolean>(null);
  currentMessage = this.messageSource.asObservable();
  // có thể subcribe theo dõi thay đổi value của biến này thay cho messageSource
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(http, "Todolist", utilitiesService);
  }
  // method này để change source message
  changeMessage(message) {
    this.messageSource.next(message);
  }

  getAllByObjectiveId(objectiveId): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/GetAllByObjectiveId?objectiveId=${objectiveId}`, {})
      .pipe(catchError(this.handleError));
  }
  getAllByObjectiveIdAsTree(objectiveId): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/GetAllByObjectiveIdAsTree?objectiveId=${objectiveId}`, {})
      .pipe(catchError(this.handleError));
  }

  l0(currentTime): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/L0?currentTime=${currentTime}`, {})
      .pipe(catchError(this.handleError));
  }
  l1(currentTime): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/L1?currentTime=${currentTime}`, {})
      .pipe(catchError(this.handleError));
  }
  functionalLeader(currentTime): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/FunctionalLeader?currentTime=${currentTime}`, {})
      .pipe(catchError(this.handleError));
  }

  l2(currentTime): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/L2?currentTime=${currentTime}`, {})
      .pipe(catchError(this.handleError));
  }
  fho(currentTime): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/fho?currentTime=${currentTime}`, {})
      .pipe(catchError(this.handleError));
  }
  updater(currentTime): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/updater?currentTime=${currentTime}`, {})
      .pipe(catchError(this.handleError));
  }
  ghr(currentTime): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/ghr?currentTime=${currentTime}`, {})
      .pipe(catchError(this.handleError));
  }
  gm(currentTime): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/gm?currentTime=${currentTime}`, {})
      .pipe(catchError(this.handleError));
  }
  getAllInCurrentQuarterByObjectiveId(objectiveId): Observable<ToDoListOfQuarter[]> {
    return this.http
      .get<ToDoListOfQuarter[]>(`${this.base}${this.entity}/GetAllInCurrentQuarterByObjectiveId?objectiveId=${objectiveId}`, {})
      .pipe(catchError(this.handleError));
  }
  /**
    * // TODO: Lấy dữ kiệu cho vai trò là L1, L2
    */
  getAllObjectiveByL1L2(): Observable<ToDoListL1L2[]> {
    return this.http
      .get<ToDoListL1L2[]>(`${this.base}${this.entity}/GetAllObjectiveByL1L2`, {})
      .pipe(catchError(this.handleError));
  }

  /**
    * // TODO: Lấy dữ kiệu cho vai trò là L1, L2 khi click vào KPI Score Button
    */
  getAllKPIScoreByAccountId(): Observable<ToDoListByLevelL1L2Dto[]> {
    return this.http
      .get<ToDoListByLevelL1L2Dto[]>(`${this.base}${this.entity}/GetAllKPIScoreL0ByAccountId`, {})
      .pipe(catchError(this.handleError));
  }
  /**
    * // TODO: Lấy dữ kiệu cho vai trò là L1, L2 khi click vào KPI Score Button
    */
  getAllKPISelfScoreByObjectiveId(objectiveId): Observable<SelfScore[]> {
    return this.http
      .get<SelfScore[]>(`${this.base}${this.entity}/getAllKPISelfScoreByObjectiveId?objectiveId=${objectiveId}`, {})
      .pipe(catchError(this.handleError));
  }
  dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }

  /**
    * // TODO: Lấy dữ kiệu cho vai trò là L1 khi click vào KPI Score Button
    */
  getAllKPIScoreL1ByAccountId(accountId, currentTime): Observable<[]> {
    return this.http
      .get<[]>(`${this.base}${this.entity}/GetAllKPIScoreL1ByAccountId?accountId=${accountId}&currentTime=${this.dateToYMD(currentTime)}`, {})
      .pipe(catchError(this.handleError));
  }

  /**
  * // TODO: Lấy dữ kiệu cho vai trò là  L2 khi click vào KPI Score Button
  */
  getAllKPIScoreL2ByAccountId(accountId, currentTime): Observable<[]> {
    return this.http
      .get<[]>(`${this.base}${this.entity}/GetAllKPIScoreL2ByAccountId?accountId=${accountId}&currentTime=${this.dateToYMD(currentTime)}`, {})
      .pipe(catchError(this.handleError));
  }
  /**
  * // TODO: Lấy dữ kiệu cho vai trò là GHR khi click vào KPI Score Button
  */
  getAllKPIScoreGHRByAccountId(accountId, currentTime): Observable<[]> {
    return this.http
      .get<[]>(`${this.base}${this.entity}/GetAllKPIScoreGHRByAccountId?accountId=${accountId}&currentTime=${this.dateToYMD(currentTime)}`, {})
      .pipe(catchError(this.handleError));
  }
  /**
     * // TODO: Lấy dữ kiệu cho vai trò là L1, L2 khi click vào KPI Score Button
     */
  getAllKPIScoreL0ByPeriod(period): Observable<[]> {
    return this.http
      .get<[]>(`${this.base}${this.entity}/GetAllKPIScoreL0ByPeriod?period=${period}`, {})
      .pipe(catchError(this.handleError));
  }
  getAllAttitudeScoreByFunctionalLeader(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/GetAllAttitudeScoreByFunctionalLeader`, {})
      .pipe(catchError(this.handleError));
  }
  getQuarterlySetting(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.base}${this.entity}/getQuarterlySetting`, {})
      .pipe(catchError(this.handleError));
  }
  /**
     * // TODO: Lấy dữ kiệu cho vai trò là L1 khi click vào KPI Score Button
     */
  getAllAttitudeScoreL1ByAccountId(accountId): Observable<[]> {
    return this.http
      .get<[]>(`${this.base}${this.entity}/GetAllAttitudeScoreL1ByAccountId?accountId=${accountId}`, {})
      .pipe(catchError(this.handleError));
  }
  /**
   * // TODO: Lấy dữ kiệu cho vai trò là  L2 khi click vào KPI Score Button
   */
  getAllAttitudeScoreL2ByAccountId(accountId): Observable<[]> {
    return this.http
      .get<[]>(`${this.base}${this.entity}/GetAllAttitudeScoreL2ByAccountId?accountId=${accountId}`, {})
      .pipe(catchError(this.handleError));
  }
  /**
* // TODO: Lấy dữ kiệu cho vai trò là  L2 khi click vào KPI Score Button
*/
  getAllAttitudeScoreGHRByAccountId(accountId): Observable<[]> {
    return this.http
      .get<[]>(`${this.base}${this.entity}/getAllAttitudeScoreGHRByAccountId?accountId=${accountId}`, {})
      .pipe(catchError(this.handleError));
  }
  /**
   * // TODO: Lấy dữ kiệu cho vai trò là  L2 khi click vào KPI Score Button
   */
   getAllAttitudeScoreGFLByAccountId(accountId): Observable<[]> {
    return this.http
      .get<[]>(`${this.base}${this.entity}/getAllAttitudeScoreGFLByAccountId?accountId=${accountId}`, {})
      .pipe(catchError(this.handleError));
  }
  import(file, uploadBy) {
    const formData = new FormData();
    formData.append('UploadedFile', file);
    formData.append('UploadBy', uploadBy);
    return this.http.post(uploadBy + 'todolist/Import', formData);
  }
  reject(ids): Observable<OperationResult> {
    return this.http
      .put<OperationResult>(`${this.base}${this.entity}/reject`, { ids })
      .pipe(catchError(this.handleError));
  }
  disableReject(ids): Observable<OperationResult> {
    return this.http
      .put<OperationResult>(`${this.base}${this.entity}/DisableReject`, { ids })
      .pipe(catchError(this.handleError));
  }
  release(ids): Observable<OperationResult> {
    return this.http
      .put<OperationResult>(`${this.base}${this.entity}/release`, { ids })
      .pipe(catchError(this.handleError));
  }
}
