import { BehaviorSubject, throwError } from 'rxjs';
import { MessageConstants } from '../_constants/system';
export class BaseService {
    valueSource = new BehaviorSubject<MessageConstants>(null);
    currentValue = this.valueSource.asObservable();
    constructor() { }

    protected handleError(errorResponse: any) {
        if (errorResponse?.error?.message) {
            return throwError(errorResponse?.error?.message || 'Server error');
        }

        if (errorResponse?.error?.errors) {
            let modelStateErrors = '';

            // for now just concatenate the error descriptions, alternative we could simply pass the entire error response upstream
            for (const errorMsg of errorResponse?.error?.errors) {
                modelStateErrors += errorMsg + '<br/>';
            }
            return throwError(modelStateErrors || 'Server error');
        }
        return throwError('Server error');
    }
    changeValue(message: MessageConstants) {
        this.valueSource.next(message);
    }
}
