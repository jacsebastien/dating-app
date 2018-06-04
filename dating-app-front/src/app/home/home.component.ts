import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    isRegisterMode = false;

    values: {id: number, name: string};

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.getValues();
    }

    registerToggle() {
        this.isRegisterMode = !this.isRegisterMode;
    }

    getValues() {
        this.http.get('http://localhost:5000/api/values')
        .subscribe((response: {id: number, name: string}) => {
            this.values = response;
        });
    }
}
