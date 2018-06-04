import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
    model: any = {};

    constructor(
        private authService: AuthService,
        private alertify: AlertifyService
    ) { }

    ngOnInit() {
    }

    login(): void {
        this.authService.login(this.model)
        .subscribe(data => {
            this.alertify.success("Logged in successfully");
        }, error => {
            this.alertify.error(error);
        });
    }

    logout(): void {
        this.authService.logout();
        this.alertify.message("Logged out");
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }
}
