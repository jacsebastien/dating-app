import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    model: any = {};
    @Input() valuesFromHome: any;
    @Output() cancelRegister = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit() {
    }

    register(): void {
        console.log(this.model);
    }

    cancel(): void {
        this.cancelRegister.emit(false);
        console.log("Cancel");
    }
}
