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
    }

    setRegisterMode(): void {
        this.isRegisterMode = true;
    }

    cancelRegisterMode(isRegister: boolean) {
        this.isRegisterMode = isRegister;
    }
}
