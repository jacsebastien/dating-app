import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
    model: any = {};

    constructor(private authService: AuthService) { }

    ngOnInit() {
    }

    login(): void {
        this.authService.login(this.model)
        .subscribe(data => {
            console.log("Logged in successfully");
        }, error => {
            console.log(error);
        });
    }

    logout(): void {
        this.authService.logout();
        console.log("Logged out");
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }
}
