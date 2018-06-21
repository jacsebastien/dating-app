import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user.model';
import { catchError } from 'rxjs/operators';
import { ErrorsService } from './errors.service';

@Injectable()
export class UserService {
    private baseUrl = environment.apiUrl + 'users/';
    private localStorageItem = environment.localStorageToken;

    constructor(
        private http: HttpClient,
        private errorsSrv: ErrorsService
    ) { }

    getUsers(): Observable<User[] | string> {
        return this.http.get<User[]>(this.baseUrl, this.getHeaders())
        .pipe(
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    getUser(id: number): Observable<User | string> {
        return this.http.get<User>(this.baseUrl + id, this.getHeaders())
        .pipe(
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    updateUser(userId: number, user: User): Observable<string | {}> {
        return this.http.put<{}>(this.baseUrl + userId, user, this.getHeaders())
        .pipe(
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    setMainPhoto(userId: number, photoId: number): Observable<string | {}> {
        return this.http.post<{}>(this.baseUrl + userId + `/photos/${photoId}/setMain`, {}, this.getHeaders())
        .pipe(
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    deletePhoto(userId: number, photoId: number): Observable<string | {}> {
        return this.http.delete<{}>(this.baseUrl + userId + `/photos/${photoId}`, this.getHeaders())
        .pipe(
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    private getHeaders(): {headers: HttpHeaders} {
        let headers = new HttpHeaders({ 'Content-type': 'application/json'});
        const token = localStorage.getItem(this.localStorageItem);
        if(token) {
            headers = headers.append('Authorization', 'Bearer ' + token);
            console.log(headers);
        }

        return { headers: headers };
    }
}
