import { CURDService } from './CURD.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Employee } from '../_model/employee';
import { UtilitiesService } from './utilities.service';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends CURDService<Employee> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(http,"Employee", utilitiesService);
  }
  importExcel(file) {
    const formData = new FormData();
    formData.append('UploadedFile', file);
    formData.append('CreatedBy', JSON.parse(localStorage.getItem('user')).id);
    return this.http.post(this.base + 'Employee/ImportExcel', formData);
  }
}
