import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { environment } from '../../environments/environment';
import { ErrorsService } from './errors.service';

@Injectable()
export class AuthService {
    private baseUrl = 'http://localhost:5000/api/auth/';
    private localStorageItem = environment.localStorageToken;

    private userToken: string;
    private decodedToken: any;

    private jwtHelper: JwtHelper = new JwtHelper;

    constructor(
        private http: HttpClient,
        private errorsSrv: ErrorsService
    ) { }

    login(model: any): any {
        const httpOptions = this.getHeaders();

        return this.http.post(this.baseUrl + 'login', model, httpOptions)
        .pipe(
            tap((response: any) => {
                if(response) {
                    localStorage.setItem(this.localStorageItem, response.tokenString);
                    this.decodedToken = this.jwtHelper.decodeToken(response.tokenString);
                    console.log(this.decodedToken);

                    this.userToken = response.tokenString;
                }
            }),
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    logout() {
        this.userToken = null;
        localStorage.removeItem(this.localStorageItem);
    }

    register(model: any): any {
        const httpOptions = this.getHeaders();

        return this.http.post(this.baseUrl + 'register', model, httpOptions)
        .pipe(
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    isAuthenticated(): boolean {
        return tokenNotExpired(this.localStorageItem);
        // const token = localStorage.getItem(this.localStorageItem);
        // return !!token;
    }

    setDecodedToken() {
        const token = localStorage.getItem(this.localStorageItem);
        if(token) {
            this.decodedToken = this.jwtHelper.decodeToken(token);
        }
    }

    usernameFromToken() {
        return this.decodedToken? this.decodedToken.unique_name : "";
    }

    private getHeaders(): {headers: HttpHeaders} {
        const headers = new HttpHeaders({'Content-type': 'application/json'});
        return {headers: headers};
    }
}
