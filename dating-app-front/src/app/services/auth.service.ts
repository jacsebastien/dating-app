import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../environments/environment';
import { ErrorsService } from './errors.service';

@Injectable()
export class AuthService {
    private baseUrl = 'http://localhost:5000/api/auth/';
    private localStorageItem = environment.localStorageToken;

    private userToken: string;
    private decodedToken: any;

    constructor(
        private http: HttpClient,
        private errorsSrv: ErrorsService,
        private jwtHelperSrv: JwtHelperService
    ) { }

    login(model: any): any {
        const httpOptions = this.getHeaders();

        return this.http.post(this.baseUrl + 'login', model, httpOptions)
        .pipe(
            tap((user: any) => {
                if(user) {
                    localStorage.setItem(this.localStorageItem, user.tokenString);
                    this.decodedToken = this.jwtHelperSrv.decodeToken(user.tokenString);
                    console.log(this.decodedToken);

                    this.userToken = user.tokenString;
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
        const token = this.jwtHelperSrv.tokenGetter();
        if(!token) {
            return false;
        }

        return !this.jwtHelperSrv.isTokenExpired(this.localStorageItem);
        // const token = localStorage.getItem(this.localStorageItem);
        // return !!token;
    }

    setDecodedToken() {
        const token = localStorage.getItem(this.localStorageItem);
        if(token) {
            this.decodedToken = this.jwtHelperSrv.decodeToken(token);
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
