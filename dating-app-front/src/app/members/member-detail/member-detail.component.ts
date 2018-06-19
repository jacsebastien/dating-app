import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
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
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        // Use resolver to retrieve user data after route loading
        this.route.data
        .subscribe(data => {
            this.user = data['user'];
        });
    }
}
