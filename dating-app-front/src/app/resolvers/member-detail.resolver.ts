import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {
    constructor(
        private userService: UserService,
        private router: Router,
        private alertify: AlertifyService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
        const id: number = route.params['id'];

        // no need to subscribe, route resolver do it automatically
        return this.userService.getUser(id)
        .catch(error => {
            this.alertify.error('Problem retrieving data');
            this.router.navigate(['/members']);
            return Observable.of(null);
        });
    }
}
