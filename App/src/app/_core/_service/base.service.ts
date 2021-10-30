import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { MessageConstants } from '../_constants/system';
export class BaseService {
    valueSource = new BehaviorSubject<MessageConstants>(null);
    currentValue = this.valueSource.asObservable();
    constructor() { }

    protected handleError(errorResponse: any) {
      if (errorResponse instanceof HttpErrorResponse) {
        if (errorResponse.status === 401) {
          return throwError(errorResponse.statusText);
        }
        const applicationError = errorResponse.headers.get('Application-Error');
        if (applicationError) {
          console.error(applicationError);
          return throwError(applicationError);
        }
        const serverError = errorResponse.error;
        let modalStateErrors = '';
        if (serverError && typeof serverError === 'object') {
          for (const key in serverError) {
            if (serverError[key]) {
              modalStateErrors += serverError[key] + '\n';
            }
          }
        }
        return throwError(modalStateErrors || serverError || 'Server Error');
      }
    }
    changeValue(message: MessageConstants) {
        this.valueSource.next(message);
    }
}
