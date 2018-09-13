import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
    users: User[];

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        // Use resolver to retrieve user data after route loading
        this.route.data
        .subscribe(data => {
            this.users = data['users'].result;
        });
    }
}
