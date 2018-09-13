import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../../models/pagination.model';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
    users: User[];
    pagination: Pagination;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private alertify: AlertifyService
    ) { }

    ngOnInit() {
        // Use resolver to retrieve user data after route loading
        this.route.data
        .subscribe(data => {
            this.users = data['users'].result;
            this.pagination = data['users'].pagination;
        });
    }

    pageChanged(event: any): void {
        this.pagination.currentPage = event.page;
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage)
        .subscribe((res: PaginatedResult<User[]>) => {
            this.users = res.result;
            this.pagination = res.pagination;
        }, error => {
            this.alertify.error(error);
        });
    }
}
