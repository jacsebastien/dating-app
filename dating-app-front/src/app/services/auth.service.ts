import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class AuthService {
    baseUrl = 'http://localhost:5000/api/auth/';
    userToken: any;

    constructor(private http: HttpClient) { }

    login(model: any): any {
        const headers = new HttpHeaders({'Content-type': 'application/json'});
        const httpOptions = {headers: headers};

        return this.http.post(this.baseUrl + 'login', model, httpOptions)
        .pipe(
            tap((response: any) => {
                if(response) {
                    localStorage.setItem('token', response.tokenString);
                    this.userToken = response.tokenString;
                }
            })
        );
    }
}
