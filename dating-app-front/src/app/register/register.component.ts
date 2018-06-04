import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    model: any = {};
    @Output() cancelRegister = new EventEmitter<boolean>();

    constructor(
        private authService: AuthService,
        private alertify: AlertifyService
    ) { }

    ngOnInit() {
    }

    register(): void {
        this.authService.register(this.model)
        .subscribe(() => {
            this.alertify.success("Registration successful");
        }, error => {
            this.alertify.error(error);
        });
    }

    cancel(): void {
        this.cancelRegister.emit(false);
    }
}
