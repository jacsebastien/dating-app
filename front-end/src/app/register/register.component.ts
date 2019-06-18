import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import { User } from '../models/user.model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    @Output() cancelRegister = new EventEmitter<boolean>();
    user: User;
    registerForm: FormGroup;

    constructor(
        private authService: AuthService,
        private alertify: AlertifyService,
        private fb: FormBuilder,
        private router: Router
    ) { }

    ngOnInit() {
        this.initForm();
    }

    isErrors(controlName: string): boolean {
        const control = this.registerForm.get(controlName);
        return control.invalid && control.touched;
    }

    register(): void {
        console.log(this.registerForm.value);

        if(this.registerForm.valid) {
            // Clone values into an empty object and store it into user property
            this.user = Object.assign({}, this.registerForm.value);
            this.authService.register(this.user)
            .subscribe(() => {
                this.alertify.success("Registration successful");
            }, error => {
                this.alertify.error(error);
            }, () => {
                this.authService.login(this.user)
                .subscribe(() => {
                    this.router.navigate(['/members']);
                });
            });
        }
    }

    cancel(): void {
        this.cancelRegister.emit(false);
    }

    private initForm() {
        this.registerForm = this.fb.group({
            gender: ['male'],
            username: ['', Validators.required],
            knowAs: ['', Validators.required],
            dateOfBirth: [null, Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
            confirmPassword: ['', Validators.required]
        }, {Validators: this.passwordMatchValidator});
    }

    // Check if password and confirmPassword matches
    private passwordMatchValidator(g: FormGroup): { mismatch: boolean } {
        return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
    }
}
