import { Injectable } from '@angular/core';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ErrorsService {

    constructor() { }

    handleHttpError(error: HttpErrorResponse): Observable<string> {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            return new ErrorObservable(error.error.message);
        }

        const applicationError = error.headers.get("Application-Error");

        if (applicationError) {
            return new ErrorObservable(applicationError);
        }

        const serverError = error.error;
        let modelStateErrors = '';

        if (serverError) {
            // loop into all error object keys, add it to modelStateErrors with linebreak after it
            for (const key in serverError) {
                if (serverError[key]) {
                    modelStateErrors += serverError[key] + '\n';
                }
            }
        }

        return new ErrorObservable(
            modelStateErrors || "Server error"
        );
    }

}
