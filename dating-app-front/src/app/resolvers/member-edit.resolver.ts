import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { AuthService } from '../services/auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
        private alertify: AlertifyService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
        // no need to subscribe, route resolver do it automatically
        return this.userService.getUser(this.authService.getDecodedToken().nameid)
        .catch(error => {
            this.alertify.error('Problem retrieving data');
            this.router.navigate(['/members']);
            return Observable.of(null);
        });
    }
}