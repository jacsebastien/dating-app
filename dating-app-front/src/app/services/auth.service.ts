import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
    baseUrl = 'http://localhost:5000/api/auth/';
    localStorageItem = 'dating-app-token';
    userToken: any;

    constructor(private http: HttpClient) { }

    login(model: any): any {
        const httpOptions = this.getRequestOptions();

        return this.http.post(this.baseUrl + 'login', model, httpOptions)
        .pipe(
            tap((response: any) => {
                if(response) {
                    localStorage.setItem(this.localStorageItem, response.tokenString);
                    this.userToken = response.tokenString;
                }
            }),
            catchError(this.handleError)
        );
    }

    logout() {
        this.userToken = null;
        localStorage.removeItem(this.localStorageItem);
    }

    register(model: any): any {
        const httpOptions = this.getRequestOptions();

        return this.http.post(this.baseUrl + 'register', model, httpOptions)
        .pipe(
            catchError(this.handleError)
        );
    }

    isAuthenticated(): boolean {
        return tokenNotExpired(this.localStorageItem);
        // const token = localStorage.getItem(this.localStorageItem);
        // return !!token;
    }

    private getRequestOptions(): {headers: HttpHeaders} {
        const headers = new HttpHeaders({'Content-type': 'application/json'});
        return{headers: headers};
    }

    private handleError(error: HttpErrorResponse): Observable<string> {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            return new ErrorObservable(error.error.message);
        }

        const applicationError = error.headers.get("Application-Error");

        if(applicationError) {
            return new ErrorObservable(applicationError);
        }

        const serverError = error.error;
        let modelStateErrors = '';

        if(serverError) {
            // loop into all error object keys, add it to modelStateErrors with linebreak after it
            for(const key in serverError) {
                if(serverError[key]) {
                    modelStateErrors += serverError[key] + '\n';
                }
            }
        }

        return new ErrorObservable(
            modelStateErrors || "Server error"
        );
    }
}
