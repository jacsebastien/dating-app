import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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
        private alertify: AlertifyService,
        private fb: FormBuilder
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

    private initForm() {
        this.registerForm = this.fb.group({
            gender: ['male'],
            username: ['', Validators.required],
            knownAs: ['', Validators.required],
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
