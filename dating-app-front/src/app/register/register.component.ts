import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    model: any = {};
    @Input() valuesFromHome: any;
    @Output() cancelRegister = new EventEmitter<boolean>();

    constructor(private authService: AuthService) { }

    ngOnInit() {
    }

    register(): void {
        this.authService.register(this.model)
        .subscribe(() => {
            console.log("Registration successful");
        }, error => {
            console.log("Failed to register, error: ", error);
        });
    }

    cancel(): void {
        this.cancelRegister.emit(false);
        console.log("Cancel");
    }
}
