import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../environments/environment';
import { ErrorsService } from './errors.service';
import { AuthUser } from '../models/auth-user.model';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
    private photoUrl = new BehaviorSubject<string>('../../assets/user.png');

    private baseUrl = 'http://localhost:5000/api/auth/';
    private localStorageToken = environment.localStorageToken;
    private localStorageUser = environment.localStorageUser;

    private userToken: string;
    private decodedToken: any;
    private currentUser: User;

    currentPhotoUrl: Observable<string> = this.photoUrl.asObservable();

    constructor(
        private http: HttpClient,
        private errorsSrv: ErrorsService,
        private jwtHelperSrv: JwtHelperService
    ) { }

    login(model: any): Observable<AuthUser | string> {
        const httpOptions = this.getHeaders();

        return this.http.post<AuthUser>(this.baseUrl + 'login', model, httpOptions)
        .pipe(
            tap(authUser => {
                if(authUser) {
                    localStorage.setItem(this.localStorageToken, authUser.tokenString);

                    this.userToken = authUser.tokenString;
                    this.decodedToken = this.jwtHelperSrv.decodeToken(authUser.tokenString);
                    this.currentUser = authUser.user;

                    this.changeMemberPhoto(this.currentUser.photoUrl);
                }
            }),
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    logout(): void {
        this.userToken = null;
        this.currentUser = null;
        localStorage.removeItem(this.localStorageToken);
        localStorage.removeItem(this.localStorageUser);
    }

    register(user: User): any {
        const httpOptions = this.getHeaders();

        return this.http.post(this.baseUrl + 'register', user, httpOptions)
        .pipe(
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    changeMemberPhoto(photoUrl: string): void {
        this.currentUser.photoUrl = photoUrl;
        localStorage.setItem(this.localStorageUser, JSON.stringify(this.currentUser));

        this.photoUrl.next(photoUrl);
    }

    isAuthenticated(): boolean {
        const token = this.jwtHelperSrv.tokenGetter();

        if(!token) {
            return false;
        }

        return !this.jwtHelperSrv.isTokenExpired(token);
    }

    setDecodedToken(): void {
        const token = localStorage.getItem(this.localStorageToken);
        if(token) {
            this.decodedToken = this.jwtHelperSrv.decodeToken(token);
        }
    }

    getDecodedToken(): any {
        return this.decodedToken;
    }

    setCurrentUser(): void {
        const user: User = JSON.parse(localStorage.getItem(this.localStorageUser));
        if(user) {
            this.currentUser = user;
            this.changeMemberPhoto(user.photoUrl);
        }
    }

    usernameFromToken(): string {
        return this.decodedToken? this.decodedToken.unique_name : "";
    }

    private getHeaders(): {headers: HttpHeaders} {
        const headers = new HttpHeaders({'Content-type': 'application/json'});
        return {headers: headers};
    }
}
