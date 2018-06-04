import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    model: any = {};
    @Input() valuesFromHome: any;

    constructor() { }

    ngOnInit() {
    }

    register() {
        console.log(this.model);
    }

    cancel() {
        console.log("Cancel");
    }
}
