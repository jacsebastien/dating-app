import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
    model: any = {};
    photoUrl: string;

    constructor(
        private authService: AuthService,
        private alertify: AlertifyService,
        private router: Router
    ) { }

    ngOnInit() {
        this.authService.currentPhotoUrl
        .subscribe(photoUrl => {
            this.photoUrl = photoUrl;
        });
    }

    login(): void {
        this.authService.login(this.model)
        .subscribe(data => {
            this.alertify.success("Logged in successfully");
        }, error => {
            this.alertify.error('Failed to login');
        // On completed
        }, () => {
            this.router.navigate(['/members']);
        });
    }

    logout(): void {
        this.authService.logout();
        this.alertify.message("Logged out");
        this.router.navigate(['/home']);
    }

    getUserName(): string {
        return this.authService.usernameFromToken();
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }
}
