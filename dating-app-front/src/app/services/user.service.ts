import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user.model';
import { catchError, map } from 'rxjs/operators';
import { ErrorsService } from './errors.service';
import { PaginatedResult } from '../models/pagination.model';

@Injectable()
export class UserService {
    private baseUrl = environment.apiUrl + 'users/';
    private localStorageItem = environment.localStorageToken;

    constructor(
        private http: HttpClient,
        private errorsSrv: ErrorsService
    ) { }

    getUsers(page?: number, itemsPerPage?: number, userParams?: any): Observable<PaginatedResult<User[]> | string> {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

        let params = new HttpParams();

        if(page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page.toString());
            params = params.append('pageSize', itemsPerPage.toString());
        }

        if(userParams != null) {
            params = params.append('minAge', userParams.minAge);
            params = params.append('maxAge', userParams.maxAge);
            params = params.append('gender', userParams.gender);
        }

        return this.http.get<User[]>(this.baseUrl, {headers: this.getHeaders(), observe: 'response', params})
        .pipe(
            map(response => {
                paginatedResult.result = response.body;
                if(response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                }
                return paginatedResult;
            }),
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    getUser(id: number): Observable<User | string> {
        return this.http.get<User>(this.baseUrl + id, {headers: this.getHeaders()})
        .pipe(
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    updateUser(userId: number, user: User): Observable<string | {}> {
        return this.http.put<{}>(this.baseUrl + userId, user, {headers: this.getHeaders()})
        .pipe(
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    setMainPhoto(userId: number, photoId: number): Observable<string | {}> {
        return this.http.post<{}>(this.baseUrl + userId + `/photos/${photoId}/setMain`, {}, {headers: this.getHeaders()})
        .pipe(
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    deletePhoto(userId: number, photoId: number): Observable<string | {}> {
        return this.http.delete<{}>(this.baseUrl + userId + `/photos/${photoId}`, {headers: this.getHeaders()})
        .pipe(
            catchError(this.errorsSrv.handleHttpError)
        );
    }

    private getHeaders(): HttpHeaders {
        let headers = new HttpHeaders({ 'Content-type': 'application/json'});
        const token = localStorage.getItem(this.localStorageItem);
        if(token) {
            headers = headers.append('Authorization', 'Bearer ' + token);
            console.log(headers);
        }

        return headers;
    }
}
