import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit {
    user: User;
    userId: number;

    constructor(
        private userService: UserService,
        private alertify: AlertifyService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.userId = +this.route.snapshot.params['id'];
        this.loadUser();
    }

    loadUser() {
        this.userService.getUser(this.userId)
        .subscribe((userFromService: User) => {
            this.user = userFromService;
        }, error => {
            this.alertify.error(error);
        });
    }
}
