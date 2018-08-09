import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    @Output() cancelRegister = new EventEmitter<boolean>();
    model: any = {};
    registerForm: FormGroup;

    constructor(
        private authService: AuthService,
        private alertify: AlertifyService
    ) { }

    ngOnInit() {
        this.registerForm = new FormGroup({
            username: new FormControl(),
            password: new FormControl(),
            confirmPassword: new FormControl()
        });
    }

    register(): void {
        console.log(this.registerForm.value);
        // this.authService.register(this.model)
        // .subscribe(() => {
        //     this.alertify.success("Registration successful");
        // }, error => {
        //     this.alertify.error(error);
        // });
    }

    cancel(): void {
        this.cancelRegister.emit(false);
    }
}
